import { NextResponse } from "next/server";
import playwright from "playwright";
import crypto from "crypto";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { getUser, addSnapshot, uploadScreenshot } from "@/lib/supabase/queries";

const MAX_SIZE_PX = 16384;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, device, label } = body;

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 500 });
    }
    if (!device) {
      return NextResponse.json(
        { error: "No device provided" },
        { status: 500 }
      );
    }
    if (!process.env.BROWSERCAT_API_KEY) {
      console.error("BROWSERCAT_API_KEY environment variable is not set.");
      return NextResponse.json(
        { error: "BrowserCat API key not configured" },
        { status: 500 }
      );
    }

    const bcatUrl = "wss://api.browsercat.com/connect";
    let browser;
    try {
      browser = await playwright.chromium.connect(bcatUrl, {
        headers: { "Api-Key": process.env.BROWSERCAT_API_KEY },
      });
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
      const visibleDomElements = await page.evaluate(() => {
        function getUniqueSelector(el: Element): string {
          if (el.id) {
            return `#${CSS.escape(el.id)}`;
          }

          const parts = [];

          while (el && el.nodeType === Node.ELEMENT_NODE) {
            let part = el.nodeName.toLowerCase();

            if (el.className) {
              const classList = Array.from(el.classList)
                .map((cls) => `.${CSS.escape(cls)}`)
                .join("");
              part += classList;
            }

            const parent = el.parentElement;
            if (parent) {
              const siblings = Array.from(parent.children).filter(
                (child) => child.tagName === el.tagName
              );

              if (siblings.length > 1) {
                const index = siblings.indexOf(el) + 1;
                part += `:nth-of-type(${index})`;
              }
            }

            parts.unshift(part);
            if (!el.parentElement) break;
            el = el.parentElement;
          }

          const fullSelector = parts.join(" > ");
          return generateShortHash(fullSelector);
        }

        function generateShortHash(str: string) {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
          }
          // Convert to base36 (alphanumeric) and take first 8 characters
          return Math.abs(hash).toString(36).substring(0, 8);
        }

        // Get visible elements with their bounding boxes
        const visibleDomElements = Array.from(document.querySelectorAll("*"))
          .filter(
            (el): el is HTMLElement =>
              el instanceof HTMLElement &&
              el.offsetWidth > 0 &&
              el.offsetHeight > 0 &&
              // Only include elements that are actually visible
              window.getComputedStyle(el).display !== "none" &&
              window.getComputedStyle(el).visibility !== "hidden" &&
              // Filter out very small elements (less than 4x4 pixels)
              el.offsetWidth >= 4 &&
              el.offsetHeight >= 4
          )
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const selector = getUniqueSelector(el);

            return {
              s: selector,
              l: Math.round(rect.left + window.scrollX),
              t: Math.round(rect.top + window.scrollY),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            };
          });

        return visibleDomElements;
      });

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
      const supabase = await createClient();
      const { user } = await getUser(supabase);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 500 });
      }

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
        await addSnapshot(supabase, {
          url: url,
          label,
          device,
          domData: JSON.stringify(visibleDomElements),
          layoutHash: layoutHash,
          screenshotUrl,
          width: pageDimensions.width,
          height: pageDimensions.height,
        });
      } catch (error) {
        console.error("Error storing snapshot:", error);
        return NextResponse.json(
          { error: "Failed to store snapshot" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
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
