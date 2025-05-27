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
  doesSnapshotExist,
} from "@/lib/supabase/queries";
import { captureDom } from "./captureDom";
import { SupabaseClient } from "@supabase/supabase-js";

const MAX_SIZE_PX = 16384;
const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(request: Request) {
  const startTime = performance.now();
  const timings: Record<string, number> = {};

  try {
    const body = await request.json();
    const { url, device, label, trackingId } = body;

    // Validate required fields
    const validationStart = performance.now();
    const validationErrors = validateRequiredFields({ url, device });
    const urlResult = formatSnapshotUrl(url);
    timings.validation = performance.now() - validationStart;

    if (validationErrors) {
      return NextResponse.json(validationErrors, { status: 500 });
    }
    if (!urlResult.success) {
      return NextResponse.json({ error: urlResult.error }, { status: 500 });
    }

    const formattedUrl = urlResult.data;
    const supabaseStart = performance.now();
    const supabase = await createClient();
    timings.supabase_init = performance.now() - supabaseStart;

    // Get user and validate tracking ID
    const userValidationStart = performance.now();
    const { user, trackingIdError } = await validateUserAndTrackingId(
      supabase,
      trackingId
    );
    timings.user_validation = performance.now() - userValidationStart;

    if (trackingIdError) {
      return NextResponse.json(trackingIdError, { status: 403 });
    }

    const snapshotAlreadyExists = await doesSnapshotExist(
      supabase,
      trackingId,
      formattedUrl,
      device
    );

    if (snapshotAlreadyExists) {
      return NextResponse.json(
        { error: "Snapshot already exists" },
        { status: 400 }
      );
    }

    let browser;
    const browserStart = performance.now();
    try {
      browser = await initializeBrowser();
      timings.browser_init = performance.now() - browserStart;
    } catch (error) {
      console.error("Error connecting to browser:", error);
      return NextResponse.json(
        { error: "Failed to connect to browser" },
        { status: 500 }
      );
    }

    try {
      const contextStart = performance.now();
      const context = await browser.newContext({});
      const page = await context.newPage();
      timings.context_init = performance.now() - contextStart;

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

      const pageLoadStart = performance.now();
      await page.goto(formattedUrl, {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector("body");

      // Scroll to bottom and back to top to ensure all content is loaded
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      timings.page_load = performance.now() - pageLoadStart;

      // Get the actual page dimensions
      const dimensionsStart = performance.now();
      const pageDimensions = await page.evaluate(() => {
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        };
      });
      timings.get_dimensions = performance.now() - dimensionsStart;

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
      const screenshotStart = performance.now();
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
      timings.screenshot_capture = performance.now() - screenshotStart;

      // Convert to WebP format
      const compressionStart = performance.now();
      const compressedBuffer = await sharp(screenshotBuffer)
        .webp({
          quality: 80,
          lossless: false,
          nearLossless: false,
          smartSubsample: true,
          effort: 4,
        })
        .toBuffer();
      timings.image_compression = performance.now() - compressionStart;

      // Capture DOM data
      const domCaptureStart = performance.now();
      const visibleDomElements = await captureDom(page);
      timings.dom_capture = performance.now() - domCaptureStart;

      await browser.close();
      browser = null;

      // Generate a layout hash
      const hashStart = performance.now();
      visibleDomElements.sort(
        (a, b) => a.t - b.t || a.l - b.l || a.w - b.w || a.h - b.h
      );

      const layoutHash = crypto
        .createHash("md5")
        .update(JSON.stringify(visibleDomElements))
        .digest("hex");
      timings.hash_generation = performance.now() - hashStart;

      // Upload screenshot to Supabase Storage
      const uploadStart = performance.now();
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
      timings.screenshot_upload = performance.now() - uploadStart;

      if (!screenshotUrl) {
        return NextResponse.json(
          { error: "Failed to upload screenshot" },
          { status: 500 }
        );
      }

      // Store data in snapshots table
      const storeStart = performance.now();
      try {
        const id = await addSnapshot(supabase, {
          url: formattedUrl,
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
        timings.data_storage = performance.now() - storeStart;

        return NextResponse.json({
          success: true,
          redirect: `/dashboard?id=${id}`,
          timings: {
            total: performance.now() - startTime,
            ...timings,
          },
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
      return NextResponse.json(
        {
          error: errorMessage,
          timings: {
            total: performance.now() - startTime,
            ...timings,
          },
        },
        { status: 500 }
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  } catch (error) {
    console.error("Error capturing page:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to capture page";
    return NextResponse.json(
      {
        error: errorMessage,
        timings: {
          total: performance.now() - startTime,
          ...timings,
        },
      },
      { status: 500 }
    );
  } finally {
    console.log({
      total: performance.now() - startTime,
      ...timings,
    });
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

type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Parses and validates a URL string
 */
function parseUrl(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

/**
 * Formats and normalizes a URL for snapshot capture.
 * @param input - The URL string to format
 * @returns A Result type containing either the normalized URL or an error message
 */
function formatSnapshotUrl(input: string): Result<string> {
  if (!input) {
    return {
      success: false,
      error: "URL cannot be empty",
    };
  }

  // Remove leading/trailing spaces
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      success: false,
      error: "URL cannot be empty after trimming",
    };
  }

  // Add https:// if no protocol
  const urlWithProtocol = /^https?:\/\//i.test(trimmedInput)
    ? trimmedInput
    : `https://${trimmedInput}`;

  const url = parseUrl(urlWithProtocol);
  if (!url) {
    return {
      success: false,
      error: "Invalid URL format",
    };
  }

  // Normalize hostname (remove default ports and lowercase)
  const hostname = url.hostname.toLowerCase();

  // Normalize pathname (remove duplicate slashes, ensure no trailing slashes except root)
  const pathname = url.pathname.replace(/\/{2,}/g, "/");

  // Rebuild URL
  const normalizedUrl = `https://${hostname}${pathname}${url.search}`;

  return {
    success: true,
    data: normalizedUrl,
  };
}
