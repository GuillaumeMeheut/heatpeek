export function getBrowserName() {
  const ua = navigator.userAgent;
  if (/Chrome/.test(ua) && !/Edge|OPR/.test(ua)) return "Chrome";
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/Firefox/.test(ua)) return "Firefox";
  if (/Edg/.test(ua)) return "Edge";
  return "Unknown";
}
