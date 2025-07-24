import { setupClickTracking, teardownClickTracking } from "./tracking/clicks";
import { setupSnapshotLogic, teardownSnapshotLogic } from "./tracking/snapshot";
import {
  setupScrollTracking,
  pushScrollDepthEvent,
  teardownScrollTracking,
} from "./tracking/scrollDepth";
import { sendPageview } from "./tracking/pageviews";

export function initializeTracking(config) {
  if (!shouldTrack(config)) return;

  sendPageview(config);

  setupSnapshotLogic(config);
  setupClickTracking();
  setupScrollTracking();

  startBufferFlush(config);
}

function shouldTrack(config) {
  const pageConfig = config.data;
  if (config.device === "large-desktop") return false;
  if (pageConfig.usage_exceeded) return false;
  return true;
}

export function cleanupTracking() {
  stopBufferFlush();
  teardownClickTracking();
  teardownSnapshotLogic();
  teardownScrollTracking();
}

let eventBuffer = [];
let flushIntervalId = null;

function flushBuffer(config) {
  if (!eventBuffer.length) return;

  const payload = {
    trackingId: config.trackingId,
    path: config.path,
    device: config.device,
    browser: config.browser,
    os: config.os,
    events: eventBuffer.splice(0),
    timestamp: new Date().toISOString(),
  };

  const json = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${config.endpointAPI}/api/event/events`, json);
  } else {
    fetch(`${config.endpointAPI}/api/event/events`, {
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

export function startBufferFlush(config) {
  stopBufferFlush();
  currentConfig = config;

  flushIntervalId = setInterval(() => flushBuffer(currentConfig), 5000);

  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener(
    "heatpeek:before-navigation",
    handleBeforeNavigation
  );
}

export function stopBufferFlush() {
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
