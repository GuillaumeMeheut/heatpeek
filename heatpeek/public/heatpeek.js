(function () {
  const trackingId = document.currentScript.getAttribute("id");
  const endpoint = "http://localhost:3000/api/e";

  if (!trackingId) {
    console.error("Heatpeek: Project ID is required");
    return;
  }

  const device = getViewportDeviceCategory();
  if (device === "large-desktop") return;

  let lastClickTime = 0;
  const THROTTLE_MS = 500;

  const clickBuffer = [];
  const MAX_BUFFER_SIZE = 10;
  const MAX_INTERVAL_MS = 5000;

  function flushBuffer() {
    if (clickBuffer.length === 0) return;
    const data = JSON.stringify({
      trackingId,
      url: window.location.href,
      device,
      events: clickBuffer.splice(0, clickBuffer.length),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, data);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }).catch((error) => {
        console.error("Heatpeek: Error sending click data:", error);
      });
    }
  }

  // Set up interval to flush buffer
  setInterval(flushBuffer, MAX_INTERVAL_MS);

  window.addEventListener("beforeunload", flushBuffer);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      flushBuffer();
    }
  });

  document.addEventListener("click", (e) => {
    const now = Date.now();
    if (now - lastClickTime < THROTTLE_MS) return;
    lastClickTime = now;

    const el = e.target;
    const rect = el.getBoundingClientRect();
    const left = Math.round(rect.left + window.scrollX);
    const top = Math.round(rect.top + window.scrollY);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const visible = !!(
      el.offsetWidth ||
      el.offsetHeight ||
      el.getClientRects().length
    );

    // Generate selector using the same method as route.ts
    const selector = getUniqueSelector(el);

    // Calculate click position relative to the element
    const erx = (e.pageX - left) / width;
    const ery = (e.pageY - top) / height;

    const payload = {
      timestamp: new Date().toISOString(),
      visible,
      erx,
      ery,
      s: selector,
      l: left,
      t: top,
      w: width,
      h: height,
    };

    clickBuffer.push(payload);
    if (clickBuffer.length >= MAX_BUFFER_SIZE) {
      flushBuffer();
    }
  });
})();

function getViewportDeviceCategory() {
  const viewportWidth = window.innerWidth;

  // Device breakpoints in pixels
  const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1920,
  };

  if (viewportWidth <= BREAKPOINTS.MOBILE) {
    return "mobile";
  } else if (viewportWidth <= BREAKPOINTS.TABLET) {
    return "tablet";
  } else if (viewportWidth <= BREAKPOINTS.DESKTOP) {
    return "desktop";
  }

  return "large-desktop";
}

function getUniqueSelector(el) {
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

  const fullSelector = parts.join(" > ");
  return generateShortHash(fullSelector);
}

function generateShortHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to base36 (alphanumeric) and take first 8 characters
  return Math.abs(hash).toString(36).substring(0, 8);
}
