(function() {
  "use strict";
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
    referrer: null,
    device: null,
    init(endpointAPI, endpoint, trackingId, path, referrer, device) {
      this.endpointAPI = endpointAPI;
      this.endpoint = endpoint;
      this.trackingId = trackingId;
      this.path = path;
      this.referrer = referrer;
      this.device = device;
    },
    async fetch() {
      try {
        const response = await fetch(
          `${this.endpointAPI}/api/project/config?id=${this.trackingId}&p=${encodeURIComponent(this.path)}&d=${this.device}`
        );
        if (!response.ok) throw new Error("Failed to fetch config");
        this.data = await response.json();
        console.log(this.data);
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
  function setupClickTracking(config2) {
    if (config2.device === "large-desktop") return;
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
  let navigationHandler;
  function setupSnapshotLogic(config2) {
    if (config2.device === "large-desktop") return;
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
    const pageConfig = config2.data;
    return !!pageConfig?.page_config?.snapshot_update;
  }
  function sendSnapshot(config2) {
    fetch(`${config2.endpointAPI}/api/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingId: config2.trackingId,
        url: window.location.href,
        device: config2.device,
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
  let runningEngagementStart = null;
  let currentEngagementTime = 0;
  let engagementSent = false;
  function getEngagementTime() {
    if (runningEngagementStart) {
      return currentEngagementTime + (Date.now() - runningEngagementStart);
    } else {
      return currentEngagementTime;
    }
  }
  function resetEngagementTracking() {
    runningEngagementStart = Date.now();
    currentEngagementTime = 0;
    engagementSent = false;
  }
  function handleVisibilityChange$1() {
    if (document.visibilityState === "visible" && document.hasFocus() && runningEngagementStart === null) {
      runningEngagementStart = Date.now();
    } else if (document.visibilityState === "hidden" || !document.hasFocus()) {
      currentEngagementTime = getEngagementTime();
      runningEngagementStart = null;
    }
  }
  function pushEngagementEvent() {
    const engagementTime = getEngagementTime();
    if (engagementTime >= 1e3 && !engagementSent) {
      const buffer = getEventBuffer();
      buffer.push({
        type: "engagement",
        e: Math.round(engagementTime / 1e3),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      engagementSent = true;
    }
  }
  function setupTimeOnPageTracking() {
    teardownTimeOnPageTracking();
    resetEngagementTracking();
    document.addEventListener("visibilitychange", handleVisibilityChange$1);
    window.addEventListener("blur", handleVisibilityChange$1);
    window.addEventListener("focus", handleVisibilityChange$1);
  }
  function teardownTimeOnPageTracking() {
    document.removeEventListener("visibilitychange", handleVisibilityChange$1);
    window.removeEventListener("blur", handleVisibilityChange$1);
    window.removeEventListener("focus", handleVisibilityChange$1);
    runningEngagementStart = null;
    currentEngagementTime = 0;
    engagementSent = false;
  }
  function sendPageview(config2) {
    const buffer = getEventBuffer();
    buffer.push({
      type: "page_view",
      referrer: config2.referrer,
      is_bounce: false,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    flushBuffer();
  }
  function initializeTracking(config2) {
    startBufferFlush(config2);
    sendPageview(config2);
    if (config2.data.page_config) {
      setupSnapshotLogic(config2);
      setupClickTracking(config2);
    }
    setupScrollTracking();
    setupTimeOnPageTracking();
  }
  function cleanupTracking() {
    stopBufferFlush();
    teardownClickTracking();
    teardownSnapshotLogic();
    teardownScrollTracking();
    teardownTimeOnPageTracking();
  }
  let eventBuffer = [];
  let flushIntervalId = null;
  function flushBuffer() {
    if (!eventBuffer.length) return;
    const payload = {
      trackingId: currentConfig.trackingId,
      path: currentConfig.path,
      device: currentConfig.device,
      events: eventBuffer.splice(0)
    };
    const json = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${currentConfig.endpointAPI}/api/event`, json);
    } else {
      fetch(`${currentConfig.endpointAPI}/api/event`, {
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
    pushEngagementEvent();
    flushBuffer();
  }
  function handleVisibilityChange() {
  }
  let currentConfig;
  function startBufferFlush(config2) {
    stopBufferFlush();
    currentConfig = config2;
    flushIntervalId = setInterval(() => flushBuffer(), 5e3);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
  function stopBufferFlush() {
    if (flushIntervalId) {
      clearInterval(flushIntervalId);
      flushIntervalId = null;
    }
    window.removeEventListener("beforeunload", handleBeforeUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }
  function setupNavigationTracking() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    let lastUrl = location.pathname;
    const handlePageChange = (isSPA = false) => {
      const newUrl = location.pathname;
      if (isSPA && newUrl === lastUrl) return;
      lastUrl = newUrl;
      document.dispatchEvent(
        new CustomEvent("heatpeek:navigation", { detail: newUrl })
      );
    };
    const onHashChange = () => handlePageChange(true);
    const onPopState = () => {
      handlePageChange(true);
    };
    const onPushState = (...args) => {
      originalPushState.apply(history, args);
      handlePageChange(true);
    };
    const onReplaceState = (...args) => {
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
  function getViewportDeviceCategory() {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    if (width <= 2e3) return "desktop";
    return "large-desktop";
  }
  function isBot() {
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
  (function() {
    try {
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
      if (!trackingId || isBot()) return;
      verifyTracking(endpoint, trackingId);
      const referrer = getReferrerDomain();
      const device = getViewportDeviceCategory();
      const runTracking = (path) => {
        cleanupTracking();
        config.init(endpointAPI, endpoint, trackingId, path, referrer, device);
        config.fetch().then((configData) => {
          if (!configData || !configData.is_active) return;
          initializeTracking(config);
        });
      };
      runTracking(window.location.pathname);
      setupNavigationTracking();
      document.addEventListener("heatpeek:navigation", (e) => {
        const newPath = e.detail;
        pushScrollDepthEvent();
        pushEngagementEvent();
        flushBuffer();
        runTracking(newPath);
      });
    } catch (error) {
      console.warn("Heatpeek tracking error:", error);
    }
  })();
})();
