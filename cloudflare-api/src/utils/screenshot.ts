import { Page } from "@cloudflare/puppeteer";
import { parseHTML } from "linkedom";

export type VisibleDomElement = {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
};

export async function captureDom(page: Page): Promise<VisibleDomElement[]> {
  return await page.evaluate(() => {
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
        let hash = 0;
        for (let i = 0; i < fullSelector.length; i++) {
          const char = fullSelector.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        // Convert to base36 (alphanumeric) and take first 8 characters
        const selector = Math.abs(hash).toString(36).substring(0, 8);

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
}

export async function createLayoutHash(
  visibleDomElements: VisibleDomElement[]
): Promise<string> {
  // Sort elements by top (t), then left (l), then width (w), then height (h)
  visibleDomElements.sort(
    (a, b) => a.t - b.t || a.l - b.l || a.w - b.w || a.h - b.h
  );

  const json = JSON.stringify(visibleDomElements);
  const encoder = new TextEncoder();
  const data = encoder.encode(json);

  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export async function inlineContents(
  html: string,
  baseUrl: string
): Promise<string> {
  const { document } = parseHTML(html);

  // Important ordering: inline stylesheets first so that subsequent font and CSS URL processing can see CSS content in <style>
  await inlineStylesheets(document, baseUrl);
  // Then inline fonts referenced inside any <style> content
  await inlineFonts(document, baseUrl);
  // Then inline images and CSS background URLs
  await inlineImages(document, baseUrl);

  return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
}

async function inlineImages(
  document: Document,
  baseUrl: string
): Promise<void> {
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

  // Collect CSS background images from <style> elements as well
  const styleElements = Array.from(document.querySelectorAll("style"));
  const cssUrlRegex = /url\(["']?([^"')]+)["']?\)/g;
  for (const styleEl of styleElements) {
    const cssText = styleEl.textContent || "";
    let match;
    while ((match = cssUrlRegex.exec(cssText))) {
      const url = match[1];
      if (url && !url.startsWith("data:")) {
        imageUrls.add(url);
      }
    }
  }

  // Fetch and encode unique URLs
  await Promise.all(
    Array.from(imageUrls).map(async (src) => {
      try {
        const absoluteUrl = new URL(src, baseUrl).href;
        // Restrict to same-origin to avoid SSRF-like fetching
        const absolute = new URL(absoluteUrl);
        const base = new URL(baseUrl);
        if (absolute.origin !== base.origin) return;
        const res = await fetch(absolute.href);
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

  // Replace CSS url(...) in <style> elements
  for (const styleEl of styleElements) {
    let cssText = styleEl.textContent || "";
    cssText = cssText.replace(cssUrlRegex, (match, p1) => {
      const originalUrl = p1 as string;
      const data = srcToBase64Map.get(originalUrl);
      return data ? `url('${data}')` : match;
    });
    styleEl.textContent = cssText;
  }
}

async function inlineStylesheets(
  document: Document,
  baseUrl: string
): Promise<void> {
  const linkElements = Array.from(
    document.querySelectorAll("link[rel='stylesheet']")
  );
  for (const link of linkElements) {
    try {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("data:")) {
        const absoluteUrl = new URL(href, baseUrl).href;
        const absolute = new URL(absoluteUrl);
        const base = new URL(baseUrl);
        if (absolute.origin !== base.origin) continue;
        const res = await fetch(absolute.href);
        const css = await res.text();

        // Create a new style element
        const styleElement = document.createElement("style");
        styleElement.textContent = css;

        // Replace the link element with the style element
        link.parentNode?.replaceChild(styleElement, link);
      }
    } catch (err) {
      console.warn(
        `Failed to inline stylesheet: ${link.getAttribute("href")}`,
        err
      );
    }
  }
}

async function inlineFonts(document: Document, baseUrl: string): Promise<void> {
  const styleElements = Array.from(document.querySelectorAll("style"));
  const fontUrlRegex = /url\(["']?([^"')]+)["']?\)/g;

  for (const styleEl of styleElements) {
    let cssText = styleEl.textContent || "";
    let match;
    const fontUrls = new Set<string>();
    // Find all font URLs in @font-face src
    while ((match = fontUrlRegex.exec(cssText))) {
      const url = match[1];
      // Only process if not already a data URI
      if (url && !url.startsWith("data:")) {
        fontUrls.add(url);
      }
    }
    // Fetch and replace each font URL
    for (const fontUrl of fontUrls) {
      try {
        const absoluteUrl = new URL(fontUrl, baseUrl).href;
        const absolute = new URL(absoluteUrl);
        const base = new URL(baseUrl);
        if (absolute.origin !== base.origin) continue;
        const res = await fetch(absolute.href);
        if (!res.ok) continue;
        const buffer = await res.arrayBuffer();
        // Guess MIME type from extension
        let mime = "font/woff2";
        if (fontUrl.endsWith(".woff")) mime = "font/woff";
        if (fontUrl.endsWith(".ttf")) mime = "font/ttf";
        if (fontUrl.endsWith(".otf")) mime = "font/otf";
        if (fontUrl.endsWith(".eot")) mime = "application/vnd.ms-fontobject";
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${mime};base64,${base64}`;
        // Replace all occurrences of this fontUrl in the style
        cssText = cssText.split(fontUrl).join(dataUri);
      } catch (err) {
        console.warn(`Failed to inline font: ${fontUrl}`, err);
      }
    }
    styleEl.textContent = cssText;
  }
}
