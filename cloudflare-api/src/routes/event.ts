import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import type { QueueEventMessage } from "../types/clickhouse";

const router = new Hono<{ Bindings: Env }>();

router.post("/", cors(), async (c) => {
  try {
    const { trackingId, path, browser, device, os, timestamp, events } =
      await c.req.json();

    if (
      !trackingId ||
      !path ||
      !browser ||
      !device ||
      !os ||
      !timestamp ||
      !events ||
      !Array.isArray(events) ||
      events.length === 0
    ) {
      return c.body(null, 204);
    }

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
