import { verifyTracking } from "./utils/verifyTracking";
import { config } from "./services/config";
import { initializeTracking } from "./core/tracking";
import { setupNavigationTracking } from "./core/tracking/navigation";
import { cleanupTracking, flushBuffer } from "./core/tracking";
import { getReferrerDomain } from "./utils/getReferrer";
import { pushScrollDepthEvent } from "./core/tracking/scrollDepth";
import { pushEngagementEvent } from "./core/tracking/timeOnPage";
import { getViewportDeviceCategory } from "./utils/getDevice";

(function () {
  try {
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

    verifyTracking(endpoint, trackingId);

    if (!trackingId || detectBot()) return;

    const referrer = getReferrerDomain();
    const device = getViewportDeviceCategory();

    const runTracking = (path) => {
      cleanupTracking();

      config.init(endpointAPI, endpoint, trackingId, path, referrer, device);
      config.fetch().then((configData) => {
        if (!configData) return;
        initializeTracking(config);
      });
    };

    runTracking(window.location.pathname);

    setupNavigationTracking();

    document.addEventListener("heatpeek:navigation", (e) => {
      const newPath = e.detail;

      pushScrollDepthEvent();
      pushEngagementEvent();
      flushBuffer();

      runTracking(newPath);
    });
  } catch (error) {
    console.warn("Heatpeek tracking error:", error);
  }
})();
