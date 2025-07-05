import { getUniqueSelector } from "../../utils/getUniqueSelector";

let handleClick;
let handleNavigation;
let handleBeforeUnload;
let handleVisibilityChange;
let handleBeforeNavigation;
let intervalId;

export function setupClickTracking({ config }) {
  teardownClickTracking();

  let lastClick = 0;
  const clickCounts = new Map();
  const eventBuffer = [];
  let firstClickCount = 0;

  const MAX_BUFFER = 10;
  const THROTTLE = 500;
  const RAGE_WINDOW = 1500;
  const RAGE_THRESHOLD = 3;
  const MAX_INTERVAL = 5000;

  const flushBuffer = () => {
    if (!eventBuffer.length) return;
    const data = JSON.stringify({
      trackingId: config.trackingId,
      path: config.path,
      device: config.device,
      browser: config.browser,
      os: config.os,
      events: eventBuffer.splice(0),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${config.endpointAPI}/api/event/events`, data);
    } else {
      fetch(`${config.endpointAPI}/api/event/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    }
  };

  // Set interval flush
  intervalId = setInterval(flushBuffer, MAX_INTERVAL);

  // Pre-navigation and unload flushes
  handleBeforeUnload = flushBuffer;
  window.addEventListener("beforeunload", handleBeforeUnload);

  handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") flushBuffer();
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  handleBeforeNavigation = flushBuffer;
  document.addEventListener(
    "heatpeek:before-navigation",
    handleBeforeNavigation
  );

  // Click logic
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
    const erx = (e.pageX - left) / width;
    const ery = (e.pageY - top) / height;

    if (!clickCounts.has(selector)) clickCounts.set(selector, []);
    const arr = clickCounts.get(selector);
    arr.push(now);
    while (arr.length && arr[0] < now - RAGE_WINDOW) arr.shift();

    const isRage = arr.length >= RAGE_THRESHOLD;

    const base = { timestamp: new Date().toISOString(), selector, erx, ery };

    eventBuffer.push(
      isRage
        ? { ...base, type: "rage_click" }
        : {
            ...base,
            type: "click",
            firstClickRank: firstClickCount < 3 ? ++firstClickCount : null,
          }
    );

    if (eventBuffer.length >= MAX_BUFFER) flushBuffer();
  };
  document.addEventListener("click", handleClick);

  // Reset state on navigation
  handleNavigation = () => {
    flushBuffer();
    firstClickCount = 0;
    clickCounts.clear();
  };
  document.addEventListener("heatpeek:navigation", handleNavigation);
}

export function teardownClickTracking() {
  if (handleClick) {
    document.removeEventListener("click", handleClick);
    handleClick = null;
  }

  if (handleNavigation) {
    document.removeEventListener("heatpeek:navigation", handleNavigation);
    handleNavigation = null;
  }

  if (handleBeforeUnload) {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    handleBeforeUnload = null;
  }

  if (handleVisibilityChange) {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange = null;
  }

  if (handleBeforeNavigation) {
    document.removeEventListener(
      "heatpeek:before-navigation",
      handleBeforeNavigation
    );
    handleBeforeNavigation = null;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
