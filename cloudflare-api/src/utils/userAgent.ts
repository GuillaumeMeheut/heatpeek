import { Context } from "hono";

export function getUA(c: Context) {
  const UA = c.req.header("User-Agent") || "";
  return UA.toLowerCase();
}

export function parseUserAgent(ua: string): {
  browser: string;
  os: string;
} {
  let browser = "other";
  let os = "other";

  // Browser detection
  if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr")) {
    browser = "chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "safari";
  } else if (ua.includes("firefox")) {
    browser = "firefox";
  } else if (ua.includes("edg")) {
    browser = "edge";
  } else if (ua.includes("opr")) {
    browser = "opera";
  }

  // OS detection
  if (ua.includes("macintosh") || ua.includes("mac os x")) {
    os = "mac";
  } else if (
    ua.includes("iphone") ||
    ua.includes("ipad") ||
    ua.includes("ipod")
  ) {
    os = "ios";
  } else if (ua.includes("windows")) {
    os = "windows";
  } else if (ua.includes("android")) {
    os = "android";
  } else if (ua.includes("linux")) {
    os = "linux";
  }

  return { browser, os };
}

export function detectBot(ua: string): boolean {
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
