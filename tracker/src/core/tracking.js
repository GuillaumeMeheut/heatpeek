import { setupClickTracking, teardownClickTracking } from "./tracking/clicks";
import { setupSnapshotLogic, teardownSnapshotLogic } from "./tracking/snapshot";
import { sendPageview } from "./tracking/pageviews";

export function initializeTracking({ config }) {
  if (!shouldTrack(config)) return;

  sendPageview(config);

  setupClickTracking({ config });
  setupSnapshotLogic({ config });
}

function shouldTrack(config) {
  const pageConfig = config.get();
  console.log("shouldTrack", config);
  if (config.device === "large-desktop") return false;
  if (pageConfig?.page_config?.is_active === false) return false;
  return true;
}
