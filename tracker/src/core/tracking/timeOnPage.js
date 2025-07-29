import { getEventBuffer } from "../tracking";

// Following Plausible's engagement tracking pattern
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

function handleVisibilityChange() {
  if (
    document.visibilityState === "visible" &&
    document.hasFocus() &&
    runningEngagementStart === null
  ) {
    // Resume tracking when page becomes visible and focused
    runningEngagementStart = Date.now();
  } else if (document.visibilityState === "hidden" || !document.hasFocus()) {
    // Pause tracking when page becomes hidden or loses focus
    currentEngagementTime = getEngagementTime();
    runningEngagementStart = null;
  }
}

export function pushEngagementEvent() {
  const engagementTime = getEngagementTime();

  // Only send if there's meaningful engagement (at least 1 second) and we haven't sent yet
  if (engagementTime >= 1000 && !engagementSent) {
    const buffer = getEventBuffer();

    buffer.push({
      type: "engagement",
      e: Math.round(engagementTime / 1000),
      timestamp: new Date().toISOString(),
    });

    // Mark as sent to prevent duplicate events
    engagementSent = true;
  }
}

export function setupTimeOnPageTracking() {
  teardownTimeOnPageTracking();

  resetEngagementTracking();

  // Listen for visibility changes
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("blur", handleVisibilityChange);
  window.addEventListener("focus", handleVisibilityChange);
}

export function teardownTimeOnPageTracking() {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("blur", handleVisibilityChange);
  window.removeEventListener("focus", handleVisibilityChange);

  runningEngagementStart = null;
  currentEngagementTime = 0;
  engagementSent = false;
}
