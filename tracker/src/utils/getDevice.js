export function getViewportDeviceCategory() {
  const width = window.innerWidth;
  if (width <= 768) return "mobile";
  if (width <= 1024) return "tablet";
  if (width <= 2000) return "desktop";
  return "large-desktop";
}

export const deviceFieldMap = {
  desktop: "update_snap_desktop",
  tablet: "update_snap_tablet",
  mobile: "update_snap_mobile",
};
