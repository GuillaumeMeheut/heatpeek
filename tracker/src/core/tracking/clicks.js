import { getUniqueSelector } from "../../utils/getUniqueSelector";

export function setupClickTracking({
  trackingId,
  endpointAPI,
  device,
  browser,
}) {
  let lastClick = 0;
  const clickCounts = new Map();
  const eventBuffer = [];

  const MAX_BUFFER = 10;
  const THROTTLE = 500;
  const RAGE_WINDOW = 1500;
  const RAGE_THRESHOLD = 3;
  const MAX_INTERVAL = 5000;

  let firstClickCount = 0;

  const flushBuffer = () => {
    if (!eventBuffer.length) return;
    const data = JSON.stringify({
      trackingId,
      path: window.location.pathname,
      device,
      browser,
      events: eventBuffer.splice(0),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${endpointAPI}/api/event/events`, data);
    } else {
      fetch(`${endpointAPI}/api/event/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    }
  };

  setInterval(flushBuffer, MAX_INTERVAL);
  window.addEventListener("beforeunload", flushBuffer);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushBuffer();
  });

  document.addEventListener("click", (e) => {
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
  });

  document.addEventListener("heatpeek:navigation", () => {
    firstClickCount = 0;
    clickCounts.clear();
  });
}
