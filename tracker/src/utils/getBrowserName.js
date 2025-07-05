export function getBrowserName() {
  const ua = navigator.userAgent;
  if (/Chrome/.test(ua) && !/Edge|OPR/.test(ua)) return "chrome";
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "safari";
  if (/Firefox/.test(ua)) return "firefox";
  if (/Edg/.test(ua)) return "edge";
  return "other";
}
