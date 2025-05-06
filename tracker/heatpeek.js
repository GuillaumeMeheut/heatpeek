//TODO: add a limit when on desktop
(function () {
  const projectId = document.currentScript.getAttribute("data-id");
  const endpoint = "http://localhost:3000/api/trackClick";

  if (!projectId) {
    console.error("Heatpeek: Project ID is required");
    return;
  }

  let lastClickTime = 0;
  const THROTTLE_MS = 500;

  document.addEventListener("click", (e) => {
    const now = Date.now();
    if (now - lastClickTime < THROTTLE_MS) return;
    lastClickTime = now;

    const el = e.target;
    const rect = el.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;
    const width = rect.width;
    const height = rect.height;
    const visible = !!(
      el.offsetWidth ||
      el.offsetHeight ||
      el.getClientRects().length
    );

    // Generate selector using the same method as route.ts
    const selector = getUniqueSelector(el);

    // Calculate click position relative to the element
    const elementRelativeX = (e.pageX - left) / width;
    const elementRelativeY = (e.pageY - top) / height;

    const payload = {
      projectId,
      url: window.location.href,
      relativeX: e.pageX / document.documentElement.scrollWidth,
      relativeY: e.pageY / document.documentElement.scrollHeight,
      screenWidth: document.documentElement.scrollWidth,
      screenHeight: document.documentElement.scrollHeight,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      visible,
      selector,
      element_relative_x: elementRelativeX,
      element_relative_y: elementRelativeY,
      bbox_left: left,
      bbox_top: top,
      bbox_width: width,
      bbox_height: height,
    };

    const data = JSON.stringify(payload);

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
  });
})();

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

  return parts.join(" > ");
}
