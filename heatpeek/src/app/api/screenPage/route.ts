import { corsHeaders } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import * as pw from "playwright";
import sharp from "sharp";
import crypto from "crypto";
import { captureDom, VisibleDomElement } from "./captureDom";
import {
  getSnapshotInfos,
  updatePageConfig,
  updateSnapshot,
  uploadScreenshot,
} from "@/lib/supabase/queries";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const timings: { [key: string]: number } = {};
  let lastTiming = startTime;

  const measure = (label: string) => {
    const now = performance.now();
    timings[label] = now - lastTiming;
    lastTiming = now;
  };

  const { trackingId, url, device, snapshot } = await request.json();
  console.log("snapshot", snapshot);
  const { html, viewport, styles } = snapshot;

  let urlId: string | null = null;

  const supabase = await createServerSupabaseClientWithServiceRole();

  try {
    const result = await getSnapshotInfos(supabase, trackingId, url, device);
    measure("Get Snapshot Id and should update");

    if (!result) {
      throw new Error("Failed to get snapshot");
    }
    urlId = result.url_id;

    if (!result.should_update) {
      console.error("Snapshot is already up to date");
      return new Response("ok", {
        headers: corsHeaders(),
      });
    }
  } catch (error) {
    console.error("Error getting snapshot id", error);
    return new Response(JSON.stringify({ error: "Screenshot failed" }), {
      status: 500,
      headers: corsHeaders(),
    });
  }

  let browser;
  if (process.env.NODE_ENV === "development") {
    browser = await pw.chromium.launch({ headless: false });
  } else {
    browser = await pw.chromium.connect(`wss://api.browsercat.com/connect`, {
      headers: { "Api-Key": process.env.BROWSERCAT_API_KEY! },
    });
  }
  measure("Browser Connection");

  try {
    const sanitizedHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    const inlinedHtml = await inlineImagesAndBackgrounds(sanitizedHtml, url);
    measure("Image Inlining");

    const page = await browser.newPage();
    await page.addStyleTag({ content: styles });
    await page.setContent(inlinedHtml, { waitUntil: "load" });

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) =>
          img.decode().catch(() => {
            // skip broken images
          })
        )
      );
    });
    measure("Image Loading");

    const pageDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    });

    const visibleDomElements = await captureDom(page);
    const layoutHash = createLayoutHash(visibleDomElements);

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
    });
    measure("Screenshot Capture");

    await browser.close();

    const compressedScreenshot = await sharp(screenshotBuffer)
      .jpeg({
        quality: 75,
      })
      .toBuffer();
    measure("Image Compression");

    const publicImageUrl = await uploadScreenshot(supabase, {
      urlId,
      layoutHash,
      buffer: compressedScreenshot,
    });
    measure("Screenshot Upload");

    if (!publicImageUrl) {
      throw new Error("Failed to upload screenshot");
    }

    const resultSnapshot = await updateSnapshot(supabase, urlId, {
      dom_data: JSON.stringify(visibleDomElements),
      layout_hash: layoutHash,
      screenshot_url: publicImageUrl,
      width: pageDimensions.width,
      height: pageDimensions.height,
      should_update: false,
    });

    measure("Snapshot Update");

    if (!resultSnapshot) {
      throw new Error("Failed to update snapshot");
    }

    const resultPageConfig = await updatePageConfig(supabase, urlId, {
      update_snap: false,
    });
    measure("Page Config Update");

    if (!resultPageConfig) {
      throw new Error("Failed to update page config");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Screenshot error", error);
    return new Response(JSON.stringify({ error: "Screenshot failed" }), {
      status: 500,
      headers: corsHeaders(),
    });
  } finally {
    await browser.close();
    console.log("Performance Metrics:");
    Object.entries(timings).forEach(([label, duration]) => {
      console.log(`${label}: ${duration.toFixed(2)}ms`);
    });
    console.log(
      `Total Duration: ${(performance.now() - startTime).toFixed(2)}ms`
    );
  }
}

async function inlineImagesAndBackgrounds(
  html: string,
  baseUrl: string
): Promise<string> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const srcToBase64Map = new Map<string, string>();
  const imageUrls = new Set<string>();

  const extractUrl = (styleValue: string) => {
    const match = styleValue.match(/url\(["']?(.*?)["']?\)/);
    return match?.[1];
  };

  // Collect <img src=...>
  const imgTags = Array.from(document.querySelectorAll("img"));
  for (const img of imgTags) {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("data:")) {
      imageUrls.add(src);
    }
  }

  // Collect inline style background-image URLs
  const styledElements = Array.from(
    document.querySelectorAll<HTMLElement>("[style]")
  );
  for (const el of styledElements) {
    const style = el.getAttribute("style");
    if (style?.includes("background-image")) {
      const url = extractUrl(style);
      if (url && !url.startsWith("data:")) {
        imageUrls.add(url);
      }
    }
  }

  // Fetch and encode unique URLs
  await Promise.all(
    Array.from(imageUrls).map(async (src) => {
      try {
        const absoluteUrl = new URL(src, baseUrl).href.replace(
          "http://localhost:3001",
          "https://guillaume-meheut.vercel.app"
        );
        const res = await fetch(absoluteUrl);
        const buffer = await res.arrayBuffer();
        const mimeType = res.headers.get("content-type") || "image/png";
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUrl = `data:${mimeType};base64,${base64}`;
        srcToBase64Map.set(src, dataUrl);
      } catch (err) {
        console.warn(`Failed to inline image: ${src}`, err);
      }
    })
  );

  // Replace <img src=...>
  for (const img of imgTags) {
    const src = img.getAttribute("src");
    if (src && srcToBase64Map.has(src)) {
      img.removeAttribute("srcset");
      img.setAttribute("src", srcToBase64Map.get(src)!);
    }
  }

  // Replace inline style background-image URLs
  for (const el of styledElements) {
    let style = el.getAttribute("style")!;
    const url = extractUrl(style);
    if (url && srcToBase64Map.has(url)) {
      const dataUrl = srcToBase64Map.get(url)!;
      style = style.replace(/url\(["']?.*?["']?\)/, `url('${dataUrl}')`);
      el.setAttribute("style", style);
    }
  }

  return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
}

function createLayoutHash(visibleDomElements: VisibleDomElement[]) {
  visibleDomElements.sort(
    (a, b) => a.t - b.t || a.l - b.l || a.w - b.w || a.h - b.h
  );
  return crypto
    .createHash("md5")
    .update(JSON.stringify(visibleDomElements))
    .digest("hex");
}
