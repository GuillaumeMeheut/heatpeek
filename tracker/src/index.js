import { detectBot } from "./utils/detectBot";
import { verifyTracking } from "./utils/verifyTracking";
import { config } from "./services/config";
import { initializeTracking } from "./core/tracking";

(function () {
  const trackingId = document.currentScript.getAttribute("id");
  const endpoint = "https://heatpeek.com";
  const endpointAPI = "https://api.heatpeek.com";

  if (!trackingId || detectBot()) return;

  verifyTracking(endpoint, trackingId);

  config.init(endpointAPI, trackingId);
  config.fetch().then((configData) => {
    if (!configData) return;
    initializeTracking({ trackingId, endpoint, endpointAPI, config });
  });
})();
