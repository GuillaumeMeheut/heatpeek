import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getUser, addSnapshot, uploadScreenshot } from "@/lib/supabase/queries";

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

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Set viewport based on device type
    const viewportSizes = {
      desktop: { width: 1510, height: 1080 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    };

    await page.setViewport(
      viewportSizes[device as keyof typeof viewportSizes] ||
        viewportSizes.desktop
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("body");
    await new Promise((r) => setTimeout(r, 2000));
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Capture screenshot as buffer
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      encoding: "binary",
      type: "jpeg",
    });

    // Get the actual page dimensions
    const pageDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    });

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
          const text = el.textContent?.trim() || "";

          // Only include text if it's meaningful (more than 1 character)
          const textContent = text.length > 1 ? text : "";

          return {
            s: selector, // shortened from 'selector'
            b: {
              // shortened from 'boundingBox'
              l: Math.round(rect.left + window.scrollX), // shortened from 'left'
              t: Math.round(rect.top + window.scrollY), // shortened from 'top'
              w: Math.round(rect.width), // shortened from 'width'
              h: Math.round(rect.height), // shortened from 'height'
            },
            ...(textContent && { t: textContent }), // only include text if it exists
          };
        });

      return visibleDomElements;
    });

    await browser.close();

    // Generate a layout hash based on the visible elements
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
        buffer: screenshotBuffer,
      });
    } catch (error) {
      console.error("Error uploading screenshot:", error);
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
    return NextResponse.json(
      { error: "Failed to capture page" },
      { status: 500 }
    );
  }
}
