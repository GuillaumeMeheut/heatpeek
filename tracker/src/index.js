import { detectBot } from "./utils/detectBot";
import { verifyTracking } from "./utils/verifyTracking";
import { config } from "./services/config";
import { initializeTracking, stopBufferFlush } from "./core/tracking";
import { getViewportDeviceCategory } from "./utils/getDevice";
import { getBrowserName } from "./utils/getBrowserName";
import { getOsName } from "./utils/getOsName";
import { setupNavigationTracking } from "./core/tracking/navigation";
import { cleanupTracking } from "./core/tracking";
import { getReferrerDomain } from "./utils/getReferrer";

(function () {
  const trackingId = document.currentScript.getAttribute("id");
  let endpoint, endpointAPI;

  const isLocalhost =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  if (__IS_DEV__ && isLocalhost) {
    // Dev mode + localhost: use local endpoints
    endpoint = "http://localhost:3000";
    endpointAPI = "http://localhost:8787";
  } else if (__IS_DEV__ && !isLocalhost) {
    // Dev mode + external site: don't run tracking
    return;
  } else if (isLocalhost) {
    // Production mode + localhost: don't run tracking
    return;
  } else {
    // Production mode + external site: use production endpoints
    endpoint = "https://heatpeek.com";
    endpointAPI = "https://api.heatpeek.com";
  }

  if (!trackingId || detectBot()) return;

  verifyTracking(endpoint, trackingId);

  const device = getViewportDeviceCategory();
  const browser = getBrowserName();
  const os = getOsName();
  const referrer = getReferrerDomain();

  const runTracking = (path) => {
    cleanupTracking();

    config.init(
      endpointAPI,
      endpoint,
      trackingId,
      path,
      device,
      browser,
      os,
      referrer
    );
    config.fetch().then((configData) => {
      if (!configData) return;
      initializeTracking(config);
    });
  };

  runTracking(window.location.pathname);

  setupNavigationTracking();

  document.addEventListener("heatpeek:navigation", (e) => {
    const newPath = e.detail;
    runTracking(newPath);
  });
})();
