import { Page } from "playwright";

export type VisibleDomElement = {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
};

export async function captureDom(page: Page): Promise<VisibleDomElement[]> {
  return await page.evaluate(() => {
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
}
