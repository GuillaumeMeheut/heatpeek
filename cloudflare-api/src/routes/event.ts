import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import type { QueueEventMessage } from "../types/clickhouse";
import { getUA, parseUserAgent } from "../utils/userAgent";

// Extend Request type with needed CF properties
interface RequestWithCf extends Request {
  cf?: {
    country?: string;
    region?: string;
    city?: string;
    botManagement?: {
      score?: number;
      verifiedBot?: boolean;
    };
  };
}

const router = new Hono<{ Bindings: Env }>();

router.post("/", cors(), async (c) => {
  try {
    const { trackingId, path, device, events } = await c.req.json();

    if (
      !trackingId ||
      !path ||
      !events ||
      !Array.isArray(events) ||
      events.length === 0
    ) {
      return c.body(null, 204);
    }

    // Cast request to include cf properties
    const req = c.req.raw as RequestWithCf;

    // Access cf safely (may be undefined locally)
    const cf = req.cf ?? {};

    const ua = getUA(c);
    const { browser, os } = parseUserAgent(ua);

    const timestamp = new Date().toISOString();

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

    await c.env["heatpeek-events"].send(queueMessage);

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
