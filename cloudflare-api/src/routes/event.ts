import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import { ClickHouseService } from "../services/clickhouse";
import { ClickHouseError } from "../types/clickhouse";
import { getSnapshotCache, setSnapshotCache } from "../KV/key";
import { ProjectConfigError, SupabaseService } from "../services/supabase";
import {
  createPerformanceTracker,
  measureStep,
  finalizeMetrics,
  logPerformance,
} from "../lib/utils";
import type {
  ClickEvent,
  RageClickEventData,
  ClickHouseEvent,
  RageClickEvent,
  PageViewEvent,
  PageViewEventData,
  ScrollDepthEventData,
  ScrollDepthEvent,
} from "../types/clickhouse";

const router = new Hono<{ Bindings: Env }>();

// Helper function to process click events
async function processClickEvents(
  events: ClickEvent[],
  snapshotId: string,
  trackingId: string,
  path: string,
  device: string,
  browser: string,
  os: string,
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const clickhouseEvents: ClickHouseEvent[] = events.map((event) => ({
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
    os,
    selector: event.selector,
    erx: event.erx,
    ery: event.ery,
    inserted_at: event.timestamp,
  }));

  const result = await measureStep(metrics, "insert_clicks", () =>
    clickhouseService.insertClicks(clickhouseEvents)
  );

  return result !== ClickHouseError.QUERY_ERROR;
}

// Helper function to process rage click events
async function processRageClickEvents(
  events: RageClickEventData[],
  snapshotId: string,
  trackingId: string,
  path: string,
  device: string,
  browser: string,
  os: string,
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const rageClickEvents: RageClickEvent[] = events.map((event) => ({
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
    os,
    selector: event.selector,
    erx: event.erx,
    ery: event.ery,
    inserted_at: event.timestamp,
  }));

  const result = await measureStep(metrics, "insert_rage_raw_clicks", () =>
    clickhouseService.insertRageClicks(rageClickEvents)
  );

  return result !== ClickHouseError.QUERY_ERROR;
}

async function processScrollDepthEvents(
  events: ScrollDepthEventData[],
  snapshotId: string,
  trackingId: string,
  path: string,
  device: string,
  browser: string,
  os: string,
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const scrollDepthEvents: ScrollDepthEvent[] = events.map((event) => ({
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
    os,
    scroll_depth: event.sd,
    timestamp: event.timestamp,
  }));

  const result = await measureStep(metrics, "insert_scroll_depth", () =>
    clickhouseService.insertScrollDepth(scrollDepthEvents)
  );

  return result !== ClickHouseError.QUERY_ERROR;
}

async function processPageViewEvent(
  event: PageViewEventData,
  snapshotId: string,
  trackingId: string,
  path: string,
  device: string,
  browser: string,
  os: string,
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const pageViewEvent: PageViewEvent = {
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
    os,
    timestamp: event.timestamp,
    is_bounce: event.is_bounce,
  };

  const result = await measureStep(metrics, "insert_page_view", () =>
    clickhouseService.insertPageView([pageViewEvent])
  );

  return result !== ClickHouseError.QUERY_ERROR;
}

router.post("/pageview", cors(), async (c) => {
  const metrics = createPerformanceTracker();

  try {
    const { trackingId, path, browser, device, os, timestamp, is_bounce } =
      await measureStep(metrics, "parse_request", () => c.req.json());

    if (!trackingId || !path || !browser || !device || !os || !timestamp) {
      return c.body(null, 204);
    }

    const {
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD,
      CACHE_HEATPEEK,
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    } = c.env;

    const supabaseService = new SupabaseService(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    const clickhouseService = new ClickHouseService(
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD
    );

    let snapshotId: string | null = null;

    const cached = await getSnapshotCache(
      trackingId,
      path,
      device,
      CACHE_HEATPEEK
    );

    if (cached) {
      snapshotId = cached;
    }

    try {
      if (!snapshotId) {
        snapshotId = await measureStep(metrics, "get_snapshot_id", () =>
          supabaseService.getSnapshotId(trackingId, path, device)
        );

        await measureStep(metrics, "cache_store", () => {
          if (snapshotId) {
            return setSnapshotCache(
              trackingId,
              path,
              device,
              snapshotId,
              CACHE_HEATPEEK
            );
          }
          return Promise.resolve();
        });
      }

      if (snapshotId === ProjectConfigError.FETCH_ERROR) {
        return c.json({ success: false, error: "Database error" }, 500);
      }

      if (snapshotId === ProjectConfigError.NOT_FOUND) {
        return c.json({ success: false, error: "Snapshot not found" }, 404);
      }
    } catch (error) {
      console.error("Error getting snapshot ID:", error);
      return c.json({ success: false, error: "Internal error" }, 500);
    }

    try {
      const pageviewEvent: PageViewEventData = {
        type: "page_view",
        timestamp,
        is_bounce: is_bounce || false,
      };

      const success = await measureStep(
        metrics,
        "process_pageview",
        async () => {
          return await processPageViewEvent(
            pageviewEvent,
            snapshotId,
            trackingId,
            path,
            device,
            browser,
            os,
            clickhouseService,
            metrics
          );
        }
      );

      if (!success) {
        console.error("Failed to insert pageview into ClickHouse");
        return c.json({ success: false, error: "Database error" }, 500);
      }

      return c.json(
        {
          success: true,
          processed: {
            pageViews: 1,
          },
        },
        200
      );
    } catch (error) {
      console.error("Error processing pageview:", error);
      return c.json({ success: false, error: "Internal error" }, 500);
    } finally {
      await measureStep(metrics, "close_connection", () =>
        clickhouseService.close()
      );
    }
  } finally {
    const finalMetrics = finalizeMetrics(metrics);
    logPerformance(finalMetrics, "POST /pageview");
  }
});

router.post("/events", cors(), async (c) => {
  const metrics = createPerformanceTracker();

  try {
    const { trackingId, path, browser, device, os, events } = await measureStep(
      metrics,
      "parse_request",
      () => c.req.json()
    );

    if (
      !trackingId ||
      !path ||
      !browser ||
      !device ||
      !os ||
      !events ||
      !Array.isArray(events)
    ) {
      return c.body(null, 204);
    }

    const {
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD,
      CACHE_HEATPEEK,
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    } = c.env;

    const supabaseService = new SupabaseService(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    const clickhouseService = new ClickHouseService(
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD
    );

    let snapshotId: string | null = null;

    const cached = await getSnapshotCache(
      trackingId,
      path,
      device,
      CACHE_HEATPEEK
    );

    if (cached) {
      snapshotId = cached;
    }

    try {
      if (!snapshotId) {
        snapshotId = await measureStep(metrics, "get_snapshot_id", () =>
          supabaseService.getSnapshotId(trackingId, path, device)
        );

        await measureStep(metrics, "cache_store", () => {
          if (snapshotId) {
            return setSnapshotCache(
              trackingId,
              path,
              device,
              snapshotId,
              CACHE_HEATPEEK
            );
          }
          return Promise.resolve();
        });
      }

      if (snapshotId === ProjectConfigError.FETCH_ERROR) {
        return c.json({ success: false, error: "Database error" }, 500);
      }

      if (snapshotId === ProjectConfigError.NOT_FOUND) {
        return c.json({ success: false, error: "Snapshot not found" }, 404);
      }
    } catch (error) {
      console.error("Error getting snapshot ID:", error);
      return c.json({ success: false, error: "Internal error" }, 500);
    }

    try {
      // Group events by type
      const clickEvents: ClickEvent[] = [];
      const rageClickEvents: RageClickEventData[] = [];
      const scrollDepthEvents: ScrollDepthEventData[] = [];
      for (const event of events) {
        if (!event.type || !event.timestamp) {
          console.warn("Invalid event format:", event);
          continue;
        }

        switch (event.type) {
          case "click":
            if (
              event.selector &&
              event.erx !== undefined &&
              event.ery !== undefined
            ) {
              clickEvents.push(event as ClickEvent);
            }
            break;
          case "rage_click":
            if (
              event.selector &&
              event.erx !== undefined &&
              event.ery !== undefined
            ) {
              rageClickEvents.push(event as RageClickEventData);
            }
            break;
          case "scroll_depth":
            if (event.sd !== undefined && event.sd >= 0 && event.sd <= 100) {
              scrollDepthEvents.push(event as ScrollDepthEventData);
            }
            break;
          default:
            console.warn("Unsupported event type:", event.type);
        }
      }

      // Process each event type
      const results = await measureStep(metrics, "process_events", async () => {
        const results = {
          clicks: true,
          rageClicks: true,
          scrollDepth: true,
        };

        if (clickEvents.length > 0) {
          results.clicks = await processClickEvents(
            clickEvents,
            snapshotId,
            trackingId,
            path,
            device,
            browser,
            os,
            clickhouseService,
            metrics
          );
        }

        if (rageClickEvents.length > 0) {
          results.rageClicks = await processRageClickEvents(
            rageClickEvents,
            snapshotId,
            trackingId,
            path,
            device,
            browser,
            os,
            clickhouseService,
            metrics
          );
        }

        if (scrollDepthEvents.length > 0) {
          results.scrollDepth = await processScrollDepthEvents(
            scrollDepthEvents,
            snapshotId,
            trackingId,
            path,
            device,
            browser,
            os,
            clickhouseService,
            metrics
          );
        }

        return results;
      });

      if (!results.clicks || !results.rageClicks || !results.scrollDepth) {
        console.error("Failed to insert some events into ClickHouse");
        return c.json({ success: false, error: "Database error" }, 500);
      }

      return c.json(
        {
          success: true,
          processed: {
            clicks: clickEvents.length,
            rageClicks: rageClickEvents.length,
            scrollDepth: scrollDepthEvents.length,
          },
        },
        200
      );
    } catch (error) {
      console.error("Error processing events:", error);
      return c.json({ success: false, error: "Internal error" }, 500);
    } finally {
      await measureStep(metrics, "close_connection", () =>
        clickhouseService.close()
      );
    }
  } finally {
    const finalMetrics = finalizeMetrics(metrics);
    logPerformance(finalMetrics, "POST /events");
  }
});

export default router;
