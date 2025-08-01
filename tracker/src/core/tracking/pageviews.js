import { getEventBuffer, flushBuffer } from "../tracking";

export function sendPageview(config) {
  const buffer = getEventBuffer();

  buffer.push({
    type: "page_view",
    referrer: config.referrer,
    is_bounce: false,
    timestamp: new Date().toISOString(),
  });

  flushBuffer();
}
