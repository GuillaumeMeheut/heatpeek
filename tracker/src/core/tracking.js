import { setupClickTracking, teardownClickTracking } from "./tracking/clicks";
import { setupSnapshotLogic, teardownSnapshotLogic } from "./tracking/snapshot";
import {
  setupScrollTracking,
  pushScrollDepthEvent,
  teardownScrollTracking,
} from "./tracking/scrollDepth";
import {
  setupTimeOnPageTracking,
  pushEngagementEvent,
  teardownTimeOnPageTracking,
} from "./tracking/timeOnPage";
import { sendPageview } from "./tracking/pageviews";

export function initializeTracking(config) {
  if (!shouldTrack(config)) return;

  startBufferFlush(config);

  sendPageview(config);

  setupSnapshotLogic(config);
  setupClickTracking(config);
  setupScrollTracking();
  setupTimeOnPageTracking();
}

function shouldTrack(config) {
  const pageConfig = config.data;
  if (pageConfig.usage_exceeded) return false;
  return true;
}

export function cleanupTracking() {
  stopBufferFlush();
  teardownClickTracking();
  teardownSnapshotLogic();
  teardownScrollTracking();
  teardownTimeOnPageTracking();
}

let eventBuffer = [];
let flushIntervalId = null;

export function flushBuffer() {
  if (!eventBuffer.length) return;

  const payload = {
    trackingId: currentConfig.trackingId,
    path: currentConfig.path,
    device: currentConfig.device,
    events: eventBuffer.splice(0),
  };

  const json = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${currentConfig.endpointAPI}/api/event`, json);
  } else {
    fetch(`${currentConfig.endpointAPI}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    });
  }
}

export function getEventBuffer() {
  return eventBuffer;
}

function handleBeforeUnload() {
  pushScrollDepthEvent();
  pushEngagementEvent();
  flushBuffer();
}

function handleVisibilityChange() {}

let currentConfig;

export function startBufferFlush(config) {
  stopBufferFlush();
  currentConfig = config;

  flushIntervalId = setInterval(() => flushBuffer(), 5000);

  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

export function stopBufferFlush() {
  if (flushIntervalId) {
    clearInterval(flushIntervalId);
    flushIntervalId = null;
  }

  window.removeEventListener("beforeunload", handleBeforeUnload);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
}
