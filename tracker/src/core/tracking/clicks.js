import { getUniqueSelector } from "../../utils/getUniqueSelector";
import { getEventBuffer } from "../tracking";

let handleClick;
let handleNavigation;

export function setupClickTracking() {
  teardownClickTracking();

  const buffer = getEventBuffer();
  let lastClick = 0;
  const clickCounts = new Map();
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
    const erx = Math.round((e.pageX - left) / width);
    const ery = Math.round((e.pageY - top) / height);

    if (!clickCounts.has(selector)) clickCounts.set(selector, []);
    const arr = clickCounts.get(selector);
    arr.push(now);
    while (arr.length && arr[0] < now - RAGE_WINDOW) arr.shift();

    const isRage = arr.length >= RAGE_THRESHOLD;

    const base = {
      timestamp: new Date().toISOString(),
      selector,
      erx,
      ery,
    };

    buffer.push(
      isRage
        ? { ...base, type: "rage_click" }
        : {
            ...base,
            type: "click",
            firstClickRank: firstClickCount < 3 ? ++firstClickCount : null,
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

export function teardownClickTracking() {
  if (handleClick) {
    document.removeEventListener("click", handleClick);
    handleClick = null;
  }

  if (handleNavigation) {
    document.removeEventListener("heatpeek:navigation", handleNavigation);
    handleNavigation = null;
  }
}
