import { NextResponse } from "next/server";
import playwright from "playwright";
import crypto from "crypto";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import {
  getUser,
  addSnapshot,
  uploadScreenshot,
  getTrackingId,
} from "@/lib/supabase/queries";
import { captureDom } from "./captureDom";
import { SupabaseClient } from "@supabase/supabase-js";

const MAX_SIZE_PX = 16384;
const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, device, label, trackingId } = body;

    // Validate required fields
    const validationErrors = validateRequiredFields({ url, device });
    if (validationErrors) {
      return NextResponse.json(validationErrors, { status: 500 });
    }
    const supabase = await createClient();

    // Get user and validate tracking ID
    const { user, trackingIdError } = await validateUserAndTrackingId(
      supabase,
      trackingId
    );
    if (trackingIdError) {
      return NextResponse.json(trackingIdError, { status: 403 });
    }

    let browser;
    try {
      browser = await initializeBrowser();
    } catch (error) {
      console.error("Error connecting to browser:", error);
      return NextResponse.json(
        { error: "Failed to connect to browser" },
        { status: 500 }
      );
    }

    try {
      const context = await browser.newContext({
        // Viewport settings can be set here or per page
      });
      const page = await context.newPage();

      // Set viewport based on device type
      const viewportSizes = {
        desktop: { width: 1510, height: 1080 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 375, height: 812 },
      };

      const selectedViewport =
        viewportSizes[device as keyof typeof viewportSizes] ||
        viewportSizes.desktop;
      await page.setViewportSize(selectedViewport);

      await page.goto(url, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector("body");
      await page.waitForTimeout(2000);

      // Scroll to bottom and back to top to ensure all content is loaded
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(2000);
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(2000);

      // Get the actual page dimensions
      const pageDimensions = await page.evaluate(() => {
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        };
      });

      // Check if page is too long
      if (pageDimensions.height > MAX_SIZE_PX) {
        await browser.close();
        return NextResponse.json(
          {
            error: `Page is too long (${pageDimensions.height}px). Maximum allowed height is ${MAX_SIZE_PX}px.`,
          },
          { status: 400 }
        );
      }

      // Capture screenshot
      let screenshotBuffer;
      try {
        screenshotBuffer = await page.screenshot({
          fullPage: true,
          type: "png",
        });

        if (!screenshotBuffer || screenshotBuffer.length === 0) {
          throw new Error("Screenshot buffer is empty");
        }

        console.log(
          `Screenshot captured successfully. Size: ${screenshotBuffer.length} bytes`
        );
      } catch (error: unknown) {
        console.error("Error capturing screenshot:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        throw new Error(`Failed to capture screenshot: ${errorMessage}`);
      }

      // Convert to WebP format (sharp processing remains the same)
      const compressedBuffer = await sharp(screenshotBuffer)
        .webp({
          quality: 80,
          lossless: false,
          nearLossless: false,
          smartSubsample: true,
          effort: 4,
        })
        .toBuffer();

      // Capture DOM data
      const visibleDomElements = await captureDom(page);

      await browser.close();
      browser = null;

      // Generate a layout hash based on the visible elements
      //Sort in case element change but layout remain the same, it reduce false negatives
      visibleDomElements.sort(
        (a, b) => a.t - b.t || a.l - b.l || a.w - b.w || a.h - b.h
      );

      const layoutHash = crypto
        .createHash("md5")
        .update(JSON.stringify(visibleDomElements))
        .digest("hex");

      // Upload screenshot to Supabase Storage
      let screenshotUrl;
      try {
        screenshotUrl = await uploadScreenshot(supabase, {
          userId: user.id,
          layoutHash,
          buffer: compressedBuffer,
        });
      } catch (error) {
        console.error("Error uploading screenshot:", error);
        return NextResponse.json(
          { error: "Failed to upload screenshot" },
          { status: 500 }
        );
      }

      if (!screenshotUrl) {
        return NextResponse.json(
          { error: "Failed to upload screenshot" },
          { status: 500 }
        );
      }
      // Store data in snapshots table
      try {
        const id = await addSnapshot(supabase, {
          url: url,
          label,
          device,
          dom_data: JSON.stringify(visibleDomElements),
          layout_hash: layoutHash,
          screenshot_url: screenshotUrl,
          width: pageDimensions.width,
          height: pageDimensions.height,
          tracking_id: trackingId,
        });

        if (!id) {
          throw new Error("Failed to retrieve snapshot id");
        }

        return NextResponse.json({
          success: true,
          redirect: `/dashboard?id=${id}`,
        });
      } catch (error) {
        console.error("Error storing snapshot:", error);
        return NextResponse.json(
          { error: "Failed to store snapshot" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error capturing page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to capture page";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  } catch (error) {
    console.error("Error capturing page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to capture page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Helper functions
function validateRequiredFields({
  url,
  device,
}: {
  url?: string;
  device?: string;
}) {
  if (!url) {
    return { error: "No URL provided" };
  }
  if (!device) {
    return { error: "No device provided" };
  }
  return null;
}

async function validateUserAndTrackingId(
  supabase: SupabaseClient,
  clientTrackingId: string
) {
  const { user } = await getUser(supabase);

  if (!user) {
    return {
      user: null,
      trackingIdError: { error: "User not found" },
    };
  }

  const serverTrackingId = await getTrackingId(supabase, user.id);
  if (clientTrackingId !== serverTrackingId) {
    return {
      user: null,
      trackingIdError: { error: "Invalid tracking ID" },
    };
  }

  return { user, trackingIdError: null };
}

async function initializeBrowser() {
  if (isDevelopment) {
    return await playwright.chromium.launch();
  }

  if (!process.env.BROWSERCAT_API_KEY) {
    throw new Error("BrowserCat API key not configured");
  }

  const bcatUrl = "wss://api.browsercat.com/connect";
  return await playwright.chromium.connect(bcatUrl, {
    headers: { "Api-Key": process.env.BROWSERCAT_API_KEY },
  });
}
