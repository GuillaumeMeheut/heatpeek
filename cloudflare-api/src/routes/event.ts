import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import type { QueueEventMessage } from "../types/clickhouse";

const router = new Hono<{ Bindings: Env }>();

// Allowed browsers whitelist for normalization
const allowedBrowsers = ["Chrome", "Firefox", "Edge", "Mozilla", "Safari"];

router.post("/", cors(), async (c) => {
  try {
    const { trackingId, path, events } = await c.req.json();

    if (
      !trackingId ||
      !path ||
      !events ||
      !Array.isArray(events) ||
      events.length === 0
    ) {
      return c.body(null, 204);
    }

    // Get Cloudflare cf info from the request
    const cf = c.req.cf || {};

    console.log(cf);

    // Check bot score to ignore bots (Cloudflare bot score: 1-99, low means bot)
    const botScore = cf.botManagement?.score ?? cf.botScore ?? 99;
    if (botScore < 31) {
      // Likely a bot, skip
      return c.body(null, 204);
    }

    // Normalize browser name from cf.browser
    const browserRaw = cf.browser || "Other";
    const browser = allowedBrowsers.includes(browserRaw) ? browserRaw : "Other";

    // Device type (desktop, mobile, tablet)
    const device = cf.deviceType || "other";

    // OS name
    const os = cf.os || "Other";

    const timestamp = new Date().toISOString();

    // Create unified queue message
    const queueMessage: QueueEventMessage = {
      type: "event",
      data: {
        trackingId,
        path,
        browser,
        device,
        os,
        timestamp,
        events,
      },
    };

    // Send to queue
    await c.env["heatpeek-events"].send(queueMessage);

    // Count events by type for response
    const pageviewEvents = events.filter(
      (e: any) => e.type === "page_view"
    ).length;
    const clickEvents = events.filter((e: any) => e.type === "click").length;
    const rageClickEvents = events.filter(
      (e: any) => e.type === "rage_click"
    ).length;
    const scrollDepthEvents = events.filter(
      (e: any) => e.type === "scroll_depth"
    ).length;
    const engagementEvents = events.filter(
      (e: any) => e.type === "engagement"
    ).length;

    return c.json(
      {
        success: true,
        queued: {
          pageViews: pageviewEvents,
          clicks: clickEvents,
          rageClicks: rageClickEvents,
          scrollDepth: scrollDepthEvents,
          engagement: engagementEvents,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error queuing event:", error);
    return c.json({ success: false, error: "Internal error" }, 500);
  }
});

export default router;
