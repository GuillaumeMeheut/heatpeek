export function sendPageview(config) {
  const payload = {
    trackingId: config.trackingId,
    path: config.path,
    device: config.device,
    browser: config.browser,
    os: config.os,
    // referrer: document.referrer,
    timestamp: new Date().toISOString(),
    is_bounce: false,
  };

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      `${config.endpointAPI}/api/event/pageview`,
      JSON.stringify(payload)
    );
  } else {
    fetch(`${config.endpointAPI}/api/event/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }
}
