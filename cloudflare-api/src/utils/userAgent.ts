export function getBrowserFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (/chrome/.test(ua) && !/edge|opr/.test(ua)) return "chrome";
  if (/safari/.test(ua) && !/chrome/.test(ua)) return "safari";
  if (/firefox/.test(ua)) return "firefox";
  if (/edg/.test(ua)) return "edge";
  if (/opera/.test(ua) || /opr/.test(ua)) return "opera";

  return "other";
}

export function getOsFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (/windows/.test(ua)) return "windows";
  if (/macintosh|mac os x/.test(ua)) return "macos";
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/linux/.test(ua)) return "linux";
  if (/cros/.test(ua)) return "chromeos";

  return "other";
}

export function getDeviceFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Mobile devices
  if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/.test(ua)) {
    return "mobile";
  }

  // Tablets (iPad, Android tablets)
  if (/ipad|tablet/.test(ua)) {
    return "tablet";
  }

  // Desktop (default)
  return "desktop";
}

export function detectBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "headless",
    "selenium",
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "lighthouse",
    "webdriver",
    "phantomjs",
    "puppeteer",
    "playwright",
    "nmap",
    "nikto",
    "acunetix",
    "nessus",
    "burp",
    "zap",
    "curl",
    "wget",
    "python-requests",
    "java-http-client",
    "pingdom",
    "uptimerobot",
    "newrelic",
    "datadog",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "apache-httpclient",
    "python-urllib",
    "mozilla/5.0 (compatible;)",
    "mozilla/5.0 (bot;)",
    "mozilla/5.0 (crawler;)",
    "mozilla/5.0 (spider;)",
    "mozilla/5.0 (monitoring;)",
  ];

  return botPatterns.some((pattern) => ua.includes(pattern));
}
