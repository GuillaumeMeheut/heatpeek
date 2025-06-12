(function () {
  "use strict";

  const trackingId = document.currentScript.getAttribute("id");
  // const endpoint = "https://heatpeek.com";
  const endpoint = "http://localhost:3000";

  if (!trackingId) return;

  // Config management
  const config = {
    data: null,
    lastFetch: 0,
    CACHE_DURATION: 5 * 60 * 1000, // 2 minutes cache

    async fetch() {
      console.log("fetching config");
      // Return cached config if it's still valid
      const now = Date.now();
      if (this.data && now - this.lastFetch < this.CACHE_DURATION) {
        return this.data;
      }

      try {
        const response = await fetch(
          `http://localhost:8787/?tracking_id=${trackingId}`
        );
        if (!response.ok) throw new Error("Failed to fetch config");

        this.data = await response.json();
        this.lastFetch = now;
        return this.data;
      } catch (error) {
        console.error("Heatpeek: Error fetching config:", error);
        return null;
      }
    },

    get() {
      return this.data;
    },
  };

  // Initialize config
  config.fetch().then((configData) => {
    if (!configData) {
      console.error("Heatpeek: Failed to load configuration");
      return;
    }
    initializeTracking();
  });

  verifyTracking(endpoint, trackingId);

  function initializeTracking() {
    const device = getViewportDeviceCategory();
    if (device === "large-desktop") return;

    let lastClickTime = 0;
    const THROTTLE_MS = 500;
    let firstThreeClicks = 0;
    const MAX_FIRST_CLICKS = 3;

    const clickBuffer = [];
    const MAX_BUFFER_SIZE = 10;
    const MAX_INTERVAL_MS = 5000;

    let lastPage;

    function handlePageChange(isSPANavigation) {
      const currentPath = location.pathname;
      if (isSPANavigation && lastPage === currentPath) return;

      lastPage = currentPath;
      firstThreeClicks = 0;
    }

    // Handle hash-based routing
    window.addEventListener("hashchange", function () {
      handlePageChange(true);
    });

    // Handle history API routing
    let history = window.history;
    if (history.pushState) {
      let originalPushState = history["pushState"];
      history.pushState = function () {
        originalPushState.apply(this, arguments);
        handlePageChange(true);
      };
      window.addEventListener("popstate", function () {
        handlePageChange(true);
      });
    }

    // Handle initial page load
    function handleVisibilityChange() {
      if (!lastPage && document.visibilityState === "visible") {
        handlePageChange(false);
      }
    }

    if (
      document.visibilityState === "hidden" ||
      document.visibilityState === "prerender"
    ) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      handlePageChange(false);
    }

    // Handle back/forward cache restoration
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        handlePageChange(false);
      }
    });

    function flushBuffer() {
      if (clickBuffer.length === 0) return;
      const data = JSON.stringify({
        trackingId,
        url: window.location.pathname,
        device,
        events: clickBuffer.splice(0, clickBuffer.length),
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${endpoint}/api/e`, data);
      } else {
        fetch(`${endpoint}/api/e`, {
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
        firstClickRank:
          firstThreeClicks < MAX_FIRST_CLICKS ? firstThreeClicks + 1 : null,
      };

      clickBuffer.push(payload);
      firstThreeClicks++;
      if (clickBuffer.length >= MAX_BUFFER_SIZE) {
        flushBuffer();
      }
    });
  }
})();

async function verifyTracking(endpoint, trackingId) {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get("verifyHp"), trackingId);
  if (urlParams.get("verifyHp") === trackingId) {
    fetch(`${endpoint}/api/verify/${trackingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: true }),
    })
      .then(() => {
        window.close();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

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
