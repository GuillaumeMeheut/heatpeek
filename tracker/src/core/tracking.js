import { getBrowserName } from "../utils/getBrowserName";
import { getViewportDeviceCategory } from "../utils/getDevice";
import { setupNavigationTracking } from "./tracking/navigation";
import { setupClickTracking } from "./tracking/clicks";
import { setupSnapshotLogic } from "./tracking/snapshot";

export function initializeTracking({
  trackingId,
  endpoint,
  endpointAPI,
  config,
}) {
  const device = getViewportDeviceCategory();
  const browser = getBrowserName();

  if (!shouldTrack(device, config)) return;

  setupNavigationTracking();
  setupClickTracking({ trackingId, endpointAPI, device, browser });
  setupSnapshotLogic({ trackingId, endpoint, device, config, browser });
}

function shouldTrack(device, config) {
  const pageConfig = config.get();
  if (device === "large-desktop") return false;
  if (pageConfig?.page_config?.is_active === false) return false;
  return true;
}
