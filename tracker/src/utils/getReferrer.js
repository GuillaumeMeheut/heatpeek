export function getReferrerDomain() {
  const ref = document.referrer;
  if (!ref) return null;
  try {
    const refUrl = new URL(ref);
    const currentUrl = new URL(window.location.href);
    if (refUrl.origin === currentUrl.origin) return null;
    return refUrl.hostname;
  } catch {
    return null;
  }
}
