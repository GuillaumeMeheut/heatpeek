// core/tracking/snapshot.js
import { deviceFieldMap } from "../../utils/getDevice";

export function setupSnapshotLogic({
  trackingId,
  endpoint,
  device,
  config,
  browser,
}) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (shouldSendSnapshot(config, device, browser)) {
        sendSnapshot(endpoint, trackingId, device);
      }
    }, 2500);
  });
}

function shouldSendSnapshot(config, device, browser) {
  if (browser !== "Chrome") return false;
  const pageConfig = config.get();
  return !!pageConfig?.page_config?.[deviceFieldMap[device]];
}

function sendSnapshot(endpoint, trackingId, device) {
  fetch(`${endpoint}/api/screenPage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackingId,
      device,
      url: window.location.href,
      snapshot: captureSnapshot(),
    }),
  });
}

function captureSnapshot() {
  return {
    html: document.documentElement.outerHTML,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}
