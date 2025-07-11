import { getEventBuffer } from "../tracking";

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

  return currentDocumentHeight <= viewportHeight
    ? currentDocumentHeight
    : scrollTop + viewportHeight;
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

export function setupScrollTracking() {
  teardownScrollTracking();

  resetScrollTracking();

  recordScrollDepth();

  handleScroll = () => {
    recordScrollDepth();
  };
  window.addEventListener("scroll", handleScroll);
}

export function teardownScrollTracking() {
  if (handleScroll) {
    window.removeEventListener("scroll", handleScroll);
    handleScroll = null;
  }
  maxScrollDepthPx = 0;
}

export function pushScrollDepthEvent() {
  if (maxScrollDepthPx === 0) return;

  const buffer = getEventBuffer();

  const scrollDepthPercent = Math.round(
    (maxScrollDepthPx / currentDocumentHeight) * 100
  );

  buffer.push({
    type: "scroll_depth",
    sd: scrollDepthPercent,
    timestamp: new Date().toISOString(),
  });

  resetScrollTracking();
}
