import { NextResponse } from "next/server";
import playwright from "playwright";
import crypto from "crypto";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import {
  getUser,
  uploadScreenshots,
  getTrackingId,
  doesSnapshotExist,
  addSnapshots,
} from "@/lib/supabase/queries";
import { captureDom } from "./captureDom";
import { SupabaseClient } from "@supabase/supabase-js";

const MAX_SIZE_PX = 16384;
const isDevelopment = process.env.NODE_ENV === "development";

const viewportSizes = {
  desktop: { width: 1510, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
} as const;

type DeviceType = keyof typeof viewportSizes;

export async function POST(request: Request) {
  const startTime = performance.now();
  const timings: Record<string, number> = {};

  try {
    const body = await request.json();
    const { url, label, trackingId } = body;

    // Validate required fields
    const validationStart = performance.now();
    const validationErrors = validateRequiredFields({ url });
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
      const results: Record<DeviceType, { id?: string; error?: string }> = {
        desktop: {},
        tablet: {},
        mobile: {},
      };

      // Check if any snapshot exists for this URL
      const snapshotAlreadyExists = await doesSnapshotExist(
        supabase,
        trackingId,
        formattedUrl,
        "desktop"
      );

      if (snapshotAlreadyExists) {
        return NextResponse.json(
          { error: "Snapshot already exists for this URL" },
          { status: 400 }
        );
      }

      // Store all device captures before inserting
      const deviceCaptures: Record<
        DeviceType,
        {
          screenshotBuffer: Buffer;
          domData: string;
          layoutHash: string;
          width: number;
          height: number;
        } | null
      > = {
        desktop: null,
        tablet: null,
        mobile: null,
      };

      let hasError = false;

      // Capture for each device type
      for (const device of Object.keys(viewportSizes) as DeviceType[]) {
        const contextStart = performance.now();
        const context = await browser.newContext({});
        const page = await context.newPage();
        timings.context_init = performance.now() - contextStart;

        try {
          // Set viewport based on device type
          const selectedViewport = viewportSizes[device];
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
            throw new Error(
              `Page is too long (${pageDimensions.height}px). Maximum allowed height is ${MAX_SIZE_PX}px.`
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
          } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
            throw error;
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

          // Store the capture data
          deviceCaptures[device] = {
            screenshotBuffer: compressedBuffer,
            domData: JSON.stringify(visibleDomElements),
            layoutHash,
            width: pageDimensions.width,
            height: pageDimensions.height,
          };
        } catch (error) {
          console.error(`Error capturing ${device}:`, error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          results[device] = { error: errorMessage };
          hasError = true;
        } finally {
          await context.close();
        }
      }

      // If any device capture failed, return error
      if (hasError) {
        return NextResponse.json(
          { error: "Failed to capture all devices", results },
          { status: 500 }
        );
      }

      // Upload all screenshots
      const uploadStart = performance.now();
      const screenshotUrls: Record<DeviceType, string> = {
        desktop: "",
        tablet: "",
        mobile: "",
      };

      try {
        const uploadInfos = [];
        for (const device of Object.keys(viewportSizes) as DeviceType[]) {
          const capture = deviceCaptures[device];
          if (!capture) continue;

          uploadInfos.push({
            userId: user.id,
            layoutHash: capture.layoutHash,
            buffer: capture.screenshotBuffer,
          });
        }

        const uploadResults = await uploadScreenshots(supabase, uploadInfos);

        // Map the results back to device types
        for (const device of Object.keys(viewportSizes) as DeviceType[]) {
          const capture = deviceCaptures[device];
          if (!capture) continue;

          const screenshotUrl = uploadResults[capture.layoutHash];
          if (!screenshotUrl) {
            throw new Error(`Failed to upload screenshot for ${device}`);
          }

          screenshotUrls[device] = screenshotUrl;
        }
        timings.screenshot_upload = performance.now() - uploadStart;
      } catch (error) {
        console.error("Error uploading screenshots:", error);
        return NextResponse.json(
          { error: "Failed to upload screenshots", results },
          { status: 500 }
        );
      }

      // Store all successful captures
      const storeStart = performance.now();
      try {
        const snapshotsToInsert = [];
        for (const device of Object.keys(viewportSizes) as DeviceType[]) {
          const capture = deviceCaptures[device];
          if (!capture) continue;

          snapshotsToInsert.push({
            url: formattedUrl,
            label,
            device,
            dom_data: capture.domData,
            layout_hash: capture.layoutHash,
            screenshot_url: screenshotUrls[device],
            width: capture.width,
            height: capture.height,
            tracking_id: trackingId,
          });
        }

        const result = await addSnapshots(supabase, snapshotsToInsert);

        if (!result) {
          throw new Error("Failed to insert snapshots");
        }

        // Since we don't get the IDs back, we'll mark all devices as successful
        for (const device of Object.keys(viewportSizes) as DeviceType[]) {
          if (deviceCaptures[device]) {
            results[device] = { id: "success" };
          }
        }

        timings.data_storage = performance.now() - storeStart;
      } catch (error) {
        console.error("Error storing snapshots:", error);
        return NextResponse.json(
          { error: "Failed to store snapshots", results },
          { status: 500 }
        );
      }

      await browser.close();
      browser = null;

      return NextResponse.json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Error capturing page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to capture page";
      return NextResponse.json(
        {
          error: errorMessage,
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
function validateRequiredFields({ url }: { url?: string }) {
  if (!url) {
    return { error: "No URL provided" };
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

  // Allow localhost in development environment
  if (isDevelopment && url.hostname === "localhost") {
    return {
      success: true,
      data: urlWithProtocol,
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
