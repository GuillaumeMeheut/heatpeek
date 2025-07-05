import { detectBot } from "./utils/detectBot";
import { verifyTracking } from "./utils/verifyTracking";
import { config } from "./services/config";
import { initializeTracking } from "./core/tracking";
import { getViewportDeviceCategory } from "./utils/getDevice";
import { getBrowserName } from "./utils/getBrowserName";
import { getOsName } from "./utils/getOsName";
import { setupNavigationTracking } from "./core/tracking/navigation";
import { teardownClickTracking } from "./core/tracking/clicks";
import { teardownSnapshotLogic } from "./core/tracking/snapshot";

(function () {
  const trackingId = document.currentScript.getAttribute("id");
  // const endpoint = "http://localhost:3000";
  // const endpointAPI = "http://localhost:8787";
  const endpoint = "https://heatpeek.com";
  const endpointAPI = "https://api.heatpeek.com";

  if (!trackingId || detectBot()) return;

  verifyTracking(endpoint, trackingId);

  const device = getViewportDeviceCategory();
  const browser = getBrowserName();
  const os = getOsName();

  const runTracking = (path) => {
    teardownClickTracking();
    teardownSnapshotLogic();

    config.init(endpointAPI, endpoint, trackingId, path, device, browser, os);
    config.fetch().then((configData) => {
      if (!configData) return;
      initializeTracking({ config });
    });
  };

  runTracking(window.location.pathname);

  setupNavigationTracking();

  document.addEventListener("heatpeek:navigation", (e) => {
    const newPath = e.detail;
    runTracking(newPath);
  });
})();
