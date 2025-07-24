(function() {
  "use strict";
  function detectBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      "bot",
      "crawler",
      "spider",
      "headless",
      "selenium",
      "googlebot",
      "bingbot",
      "yandexbot",
      "duckduckbot",
      "baiduspider",
      "lighthouse",
      "webdriver",
      "phantomjs",
      "puppeteer",
      "playwright",
      "nmap",
      "nikto",
      "acunetix",
      "nessus",
      "burp",
      "zap",
      "curl",
      "wget",
      "python-requests",
      "java-http-client",
      "pingdom",
      "uptimerobot",
      "newrelic",
      "datadog",
      "facebookexternalhit",
      "twitterbot",
      "linkedinbot",
      "apache-httpclient",
      "python-urllib",
      "mozilla/5.0 (compatible;)",
      "mozilla/5.0 (bot;)",
      "mozilla/5.0 (crawler;)",
      "mozilla/5.0 (spider;)",
      "mozilla/5.0 (monitoring;)"
    ];
    return botPatterns.some((pattern) => userAgent.includes(pattern));
  }
  async function verifyTracking(endpoint, trackingId) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("verifyHp") === trackingId) {
      try {
        await fetch(`${endpoint}/api/verify/${trackingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: true })
        });
        window.close();
      } catch (error) {
        console.error("Heatpeek: verifyTracking failed", error);
      }
    }
  }
  const config = {
    data: null,
    endpointAPI: null,
    endpoint: null,
    trackingId: null,
    path: null,
    device: null,
    browser: null,
    os: null,
    referrer: null,
    init(endpointAPI, endpoint, trackingId, path, device, browser, os, referrer) {
      this.endpointAPI = endpointAPI;
      this.endpoint = endpoint;
      this.trackingId = trackingId;
      this.path = path;
      this.device = device;
      this.browser = browser;
      this.os = os;
      this.referrer = referrer;
    },
    async fetch() {
      try {
        const response = await fetch(
          `${this.endpointAPI}/api/project/config?id=${this.trackingId}&p=${encodeURIComponent(this.path)}`
        );
        if (!response.ok) throw new Error("Failed to fetch config");
        this.data = await response.json();
        return this.data;
      } catch (error) {
        return null;
      }
    }
  };
  function getUniqueSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let part = el.nodeName.toLowerCase();
      if (el.className) {
        const classList = Array.from(el.classList).map((cls) => `.${CSS.escape(cls)}`).join("");
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
    return generateShortHash(parts.join(" > "));
  }
  function generateShortHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }
  let handleClick;
  let handleNavigation;
  function setupClickTracking() {
    teardownClickTracking();
    const buffer = getEventBuffer();
    let lastClick = 0;
    const clickCounts = /* @__PURE__ */ new Map();
    let firstClickCount = 0;
    const THROTTLE = 500;
    const RAGE_WINDOW = 1500;
    const RAGE_THRESHOLD = 3;
    handleClick = (e) => {
      const now = Date.now();
      if (now - lastClick < THROTTLE) return;
      lastClick = now;
      const el = e.target;
      const rect = el.getBoundingClientRect();
      const left = Math.round(rect.left + window.scrollX);
      const top = Math.round(rect.top + window.scrollY);
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      const selector = getUniqueSelector(el);
      const erx = parseFloat(((e.pageX - left) / width).toFixed(4));
      const ery = parseFloat(((e.pageY - top) / height).toFixed(4));
      if (!clickCounts.has(selector)) clickCounts.set(selector, []);
      const arr = clickCounts.get(selector);
      arr.push(now);
      while (arr.length && arr[0] < now - RAGE_WINDOW) arr.shift();
      const isRage = arr.length >= RAGE_THRESHOLD;
      const base = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        selector,
        erx,
        ery
      };
      buffer.push(
        isRage ? { ...base, type: "rage_click" } : {
          ...base,
          type: "click",
          firstClickRank: firstClickCount < 3 ? ++firstClickCount : null
        }
      );
    };
    document.addEventListener("click", handleClick);
    handleNavigation = () => {
      firstClickCount = 0;
      clickCounts.clear();
    };
    document.addEventListener("heatpeek:navigation", handleNavigation);
  }
  function teardownClickTracking() {
    if (handleClick) {
      document.removeEventListener("click", handleClick);
      handleClick = null;
    }
    if (handleNavigation) {
      document.removeEventListener("heatpeek:navigation", handleNavigation);
      handleNavigation = null;
    }
  }
  function getViewportDeviceCategory() {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    if (width <= 2e3) return "desktop";
    return "large-desktop";
  }
  const deviceFieldMap = {
    desktop: "update_snap_desktop",
    tablet: "update_snap_tablet",
    mobile: "update_snap_mobile"
  };
  let navigationHandler;
  function setupSnapshotLogic(config2) {
    teardownSnapshotLogic();
    waitForDomIdle(() => {
      if (shouldSendSnapshot(config2)) {
        sendSnapshot(config2);
      }
    });
    navigationHandler = () => {
      waitForDomIdle(() => {
        if (shouldSendSnapshot(config2)) {
          sendSnapshot(config2);
        }
      }, 2500);
    };
    document.addEventListener("heatpeek:navigation", navigationHandler);
  }
  function teardownSnapshotLogic() {
    if (navigationHandler) {
      document.removeEventListener("heatpeek:navigation", navigationHandler);
      navigationHandler = null;
    }
  }
  function shouldSendSnapshot(config2) {
    if (config2.browser !== "chrome") return false;
    const pageConfig = config2.data;
    return !!pageConfig?.page_config?.[deviceFieldMap[config2.device]];
  }
  function sendSnapshot(config2) {
    fetch(`${config2.endpointAPI}/api/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingId: config2.trackingId,
        device: config2.device,
        browser: config2.browser,
        os: config2.os,
        url: window.location.href,
        snapshot: captureSnapshot()
      })
    });
  }
  function captureSnapshot() {
    return {
      html: document.documentElement.outerHTML,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
  function waitForDomIdle(callback, timeout = 8e3) {
    let called = false;
    let loadPromises = [];
    const runOnce = () => {
      if (called) return;
      called = true;
      Promise.all(loadPromises).then(() => {
        setTimeout(() => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(callback, { timeout: 2e3 });
          } else {
            setTimeout(callback, 500);
          }
        }, 1e3);
      }).catch(() => {
        setTimeout(callback, 2e3);
      });
    };
    const waitForImages = () => {
      return new Promise((resolve) => {
        const images = Array.from(document.querySelectorAll("img"));
        if (images.length === 0) {
          resolve();
          return;
        }
        let loadedCount = 0;
        const totalImages = images.length;
        const checkComplete = () => {
          loadedCount++;
          if (loadedCount >= totalImages) {
            resolve();
          }
        };
        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.addEventListener("load", checkComplete, { once: true });
            img.addEventListener("error", checkComplete, { once: true });
          }
        });
        setTimeout(resolve, 3e3);
      });
    };
    const waitForFonts = () => {
      return new Promise((resolve) => {
        if ("fonts" in document) {
          document.fonts.ready.then(resolve);
        } else {
          setTimeout(resolve, 1e3);
        }
      });
    };
    const waitForAnimations = () => {
      return new Promise((resolve) => {
        const animatedElements = document.querySelectorAll("*");
        const checkStyles = () => {
          let hasAnimations = false;
          let hasTransitions = false;
          animatedElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.animationName && style.animationName !== "none") {
              hasAnimations = true;
            }
            if (style.transitionProperty && style.transitionProperty !== "none") {
              hasTransitions = true;
            }
          });
          if (!hasAnimations && !hasTransitions) {
            resolve();
          } else {
            setTimeout(checkStyles, 100);
          }
        };
        setTimeout(checkStyles, 200);
        setTimeout(resolve, 2e3);
      });
    };
    const waitForNetworkIdle = () => {
      return new Promise((resolve) => {
        let lastActivity = Date.now();
        const checkIdle = () => {
          if (Date.now() - lastActivity > 1e3) {
            resolve();
          } else {
            setTimeout(checkIdle, 200);
          }
        };
        setTimeout(checkIdle, 1e3);
        setTimeout(resolve, 3e3);
      });
    };
    if (document.readyState === "complete") {
      loadPromises = [
        waitForImages(),
        waitForFonts(),
        waitForAnimations(),
        waitForNetworkIdle()
      ];
      runOnce();
    } else {
      const loadHandler = () => {
        setTimeout(() => {
          loadPromises = [
            waitForImages(),
            waitForFonts(),
            waitForAnimations(),
            waitForNetworkIdle()
          ];
          runOnce();
        }, 1e3);
      };
      window.addEventListener("load", loadHandler, { once: true });
      setTimeout(() => {
        if (!called) {
          loadPromises = [
            waitForImages(),
            waitForFonts(),
            waitForAnimations(),
            waitForNetworkIdle()
          ];
          runOnce();
        }
      }, timeout);
    }
  }
  let maxScrollDepthPx = 0;
  let currentDocumentHeight = 0;
  function getDocumentHeight() {
    const body = document.body || {};
    const el = document.documentElement || {};
    return Math.max(
      body.scrollHeight || 0,
      body.offsetHeight || 0,
      body.clientHeight || 0,
      el.scrollHeight || 0,
      el.offsetHeight || 0,
      el.clientHeight || 0
    );
  }
  function getCurrentScrollDepthPx() {
    const body = document.body || {};
    const el = document.documentElement || {};
    const viewportHeight = window.innerHeight || el.clientHeight || 0;
    const scrollTop = window.scrollY || el.scrollTop || body.scrollTop || 0;
    return currentDocumentHeight <= viewportHeight ? currentDocumentHeight : scrollTop + viewportHeight;
  }
  function resetScrollTracking() {
    maxScrollDepthPx = 0;
    currentDocumentHeight = getDocumentHeight();
  }
  function recordScrollDepth() {
    currentDocumentHeight = getDocumentHeight();
    const currentDepthPx = getCurrentScrollDepthPx();
    if (currentDepthPx > maxScrollDepthPx) {
      maxScrollDepthPx = currentDepthPx;
    }
  }
  let handleScroll;
  function setupScrollTracking() {
    teardownScrollTracking();
    resetScrollTracking();
    recordScrollDepth();
    handleScroll = () => {
      recordScrollDepth();
    };
    window.addEventListener("scroll", handleScroll);
  }
  function teardownScrollTracking() {
    if (handleScroll) {
      window.removeEventListener("scroll", handleScroll);
      handleScroll = null;
    }
    maxScrollDepthPx = 0;
  }
  function pushScrollDepthEvent() {
    if (maxScrollDepthPx === 0) return;
    const buffer = getEventBuffer();
    const scrollDepthPercent = Math.round(
      maxScrollDepthPx / currentDocumentHeight * 100
    );
    buffer.push({
      type: "scroll_depth",
      sd: scrollDepthPercent,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    resetScrollTracking();
  }
  function sendPageview(config2) {
    const payload = {
      trackingId: config2.trackingId,
      path: config2.path,
      device: config2.device,
      browser: config2.browser,
      os: config2.os,
      referrer: config2.referrer,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      is_bounce: false
    };
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${config2.endpointAPI}/api/event/pageview`,
        JSON.stringify(payload)
      );
    } else {
      fetch(`${config2.endpointAPI}/api/event/pageview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
  }
  function initializeTracking(config2) {
    if (!shouldTrack(config2)) return;
    sendPageview(config2);
    setupSnapshotLogic(config2);
    setupClickTracking();
    setupScrollTracking();
    startBufferFlush(config2);
  }
  function shouldTrack(config2) {
    const pageConfig = config2.data;
    if (config2.device === "large-desktop") return false;
    if (pageConfig.usage_exceeded) return false;
    return true;
  }
  function cleanupTracking() {
    stopBufferFlush();
    teardownClickTracking();
    teardownSnapshotLogic();
    teardownScrollTracking();
  }
  let eventBuffer = [];
  let flushIntervalId = null;
  function flushBuffer(config2) {
    if (!eventBuffer.length) return;
    const payload = {
      trackingId: config2.trackingId,
      path: config2.path,
      device: config2.device,
      browser: config2.browser,
      os: config2.os,
      events: eventBuffer.splice(0),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const json = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${config2.endpointAPI}/api/event/events`, json);
    } else {
      fetch(`${config2.endpointAPI}/api/event/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json
      });
    }
  }
  function getEventBuffer() {
    return eventBuffer;
  }
  function handleBeforeUnload() {
    pushScrollDepthEvent();
    flushBuffer(currentConfig);
  }
  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      flushBuffer(currentConfig);
    }
  }
  function handleBeforeNavigation() {
    pushScrollDepthEvent();
    flushBuffer(currentConfig);
  }
  let currentConfig;
  function startBufferFlush(config2) {
    stopBufferFlush();
    currentConfig = config2;
    flushIntervalId = setInterval(() => flushBuffer(currentConfig), 5e3);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener(
      "heatpeek:before-navigation",
      handleBeforeNavigation
    );
  }
  function stopBufferFlush() {
    if (flushIntervalId) {
      clearInterval(flushIntervalId);
      flushIntervalId = null;
    }
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener(
      "heatpeek:before-navigation",
      handleBeforeNavigation
    );
  }
  function getBrowserName() {
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua) && !/Edge|OPR/.test(ua)) return "chrome";
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "safari";
    if (/Firefox/.test(ua)) return "firefox";
    if (/Edg/.test(ua)) return "edge";
    return "other";
  }
  function getOsName() {
    const ua = navigator.userAgent;
    if (/windows/i.test(ua)) return "windows";
    if (/macintosh|mac os x/i.test(ua)) return "macos";
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    if (/linux/i.test(ua)) return "linux";
    if (/cros/i.test(ua)) return "chromeos";
    return "other";
  }
  function setupNavigationTracking() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    let lastUrl = location.pathname;
    let navigationTimeout = null;
    let isNavigating = false;
    const handlePageChange = (isSPA = false) => {
      const newUrl = location.pathname;
      if (isSPA && newUrl === lastUrl) return;
      lastUrl = newUrl;
      document.dispatchEvent(
        new CustomEvent("heatpeek:navigation", { detail: newUrl })
      );
    };
    const notifyBeforeNavigation = () => {
      if (isNavigating) return;
      isNavigating = true;
      document.dispatchEvent(new Event("heatpeek:before-navigation"));
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
      navigationTimeout = setTimeout(() => {
        isNavigating = false;
      }, 100);
    };
    const onHashChange = () => handlePageChange(true);
    const onPopState = () => {
      notifyBeforeNavigation();
      handlePageChange(true);
    };
    const onPushState = (...args) => {
      notifyBeforeNavigation();
      originalPushState.apply(history, args);
      handlePageChange(true);
    };
    const onReplaceState = (...args) => {
      notifyBeforeNavigation();
      originalReplaceState.apply(history, args);
      handlePageChange(true);
    };
    const onPageshow = (e) => {
      if (e.persisted) handlePageChange(false);
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageshow);
    history.pushState = onPushState;
    history.replaceState = onReplaceState;
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageshow);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
    };
  }
  function getReferrerDomain() {
    const ref = document.referrer;
    if (!ref) return null;
    try {
      const refUrl = new URL(ref);
      const currentUrl = new URL(window.location.href);
      if (refUrl.origin === currentUrl.origin) return null;
      return refUrl.hostname;
    } catch {
      return null;
    }
  }
  (function() {
    const trackingId = document.currentScript.getAttribute("id");
    let endpoint, endpointAPI;
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (isLocalhost) {
      endpoint = "http://localhost:3000";
      endpointAPI = "http://localhost:8787";
    } else if (!isLocalhost) {
      return;
    } else if (isLocalhost) {
      return;
    } else {
      endpoint = "https://heatpeek.com";
      endpointAPI = "https://api.heatpeek.com";
    }
    if (!trackingId || detectBot()) return;
    verifyTracking(endpoint, trackingId);
    const device = getViewportDeviceCategory();
    const browser = getBrowserName();
    const os = getOsName();
    const referrer = getReferrerDomain();
    const runTracking = (path) => {
      cleanupTracking();
      config.init(
        endpointAPI,
        endpoint,
        trackingId,
        path,
        device,
        browser,
        os,
        referrer
      );
      config.fetch().then((configData) => {
        if (!configData) return;
        initializeTracking(config);
      });
    };
    runTracking(window.location.pathname);
    setupNavigationTracking();
    document.addEventListener("heatpeek:navigation", (e) => {
      const newPath = e.detail;
      runTracking(newPath);
    });
  })();
})();
