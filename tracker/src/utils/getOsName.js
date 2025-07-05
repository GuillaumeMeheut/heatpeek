export function getOsName() {
  const ua = navigator.userAgent;

  if (/windows/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "macos";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/linux/i.test(ua)) return "linux";
  if (/cros/i.test(ua)) return "chromeos";
  return "other";
}
