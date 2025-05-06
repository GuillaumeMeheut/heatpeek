import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // Get the url from query parameters
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url") || "http://localhost:3001/";

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1510, height: 1080 });

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("body");
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
    const domData = await page.evaluate(() => {
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
          el = el.parentElement;
        }

        return parts.join(" > ");
      }

      // Get the full HTML
      const htmlSnapshot = document.body.outerHTML;

      // Get visible elements with their bounding boxes
      const visibleElements = Array.from(document.querySelectorAll("*"))
        .filter(
          (el): el is HTMLElement =>
            el instanceof HTMLElement &&
            el.offsetWidth > 0 &&
            el.offsetHeight > 0
        )
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const selector = getUniqueSelector(el);

          return {
            selector,
            boundingBox: {
              left: rect.left + window.scrollX,
              top: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
            },
            text: el.textContent?.trim() || "",
          };
        });

      return {
        htmlSnapshot,
        visibleElements,
      };
    });

    await browser.close();

    // Generate a layout hash based on the HTML content
    const layoutHash = crypto
      .createHash("md5")
      .update(domData.htmlSnapshot)
      .digest("hex");

    // Upload screenshot to Supabase Storage
    const supabase = await createClient();
    const fileName = `public/screenshot-${layoutHash}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, screenshotBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading screenshot:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload screenshot" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded screenshot
    const { data: publicUrlData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return NextResponse.json({
      screenshotUrl: publicUrlData?.publicUrl,
      domData,
      metadata: {
        url: targetUrl,
        dimensions: pageDimensions,
        timestamp: new Date().toISOString(),
        layoutHash,
      },
    });
  } catch (error) {
    console.error("Error capturing page:", error);
    return NextResponse.json(
      { error: "Failed to capture page" },
      { status: 500 }
    );
  }
}
