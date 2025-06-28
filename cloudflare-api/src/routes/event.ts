import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import { ClickHouseService } from "../services/clickhouse";
import { ClickHouseError } from "../types/clickhouse";
import { snapshotKey } from "../KV/key";
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
} from "../types/clickhouse";

const router = new Hono<{ Bindings: Env }>();

const EXPIRATION_TTL = 360;

// Helper function to process click events
async function processClickEvents(
  events: ClickEvent[],
  snapshotId: string,
  trackingId: string,
  path: string,
  device: string,
  browser: string,
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const clickhouseEvents: ClickHouseEvent[] = events.map((event) => ({
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
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
  clickhouseService: ClickHouseService,
  metrics: any
): Promise<boolean> {
  const rageClickEvents: RageClickEvent[] = events.map((event) => ({
    snapshot_id: snapshotId,
    tracking_id: trackingId,
    path,
    device,
    browser,
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

// New multi-event route
router.post("/events", cors(), async (c) => {
  const metrics = createPerformanceTracker();

  try {
    const { trackingId, path, browser, device, events } = await measureStep(
      metrics,
      "parse_request",
      () => c.req.json()
    );

    if (
      !trackingId ||
      !path ||
      !browser ||
      !device ||
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

    const kvKey = snapshotKey(trackingId, path);
    let snapshotId: string | ProjectConfigError | null = null;

    const cached = await measureStep(metrics, "cache_lookup", () =>
      CACHE_HEATPEEK.get(kvKey, { type: "text" })
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
            return CACHE_HEATPEEK.put(kvKey, snapshotId, {
              expirationTtl: EXPIRATION_TTL,
            });
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
          default:
            console.warn("Unsupported event type:", event.type);
        }
      }

      // Process each event type
      const results = await measureStep(metrics, "process_events", async () => {
        const results = {
          clicks: true,
          rageClicks: true,
        };

        if (clickEvents.length > 0) {
          results.clicks = await processClickEvents(
            clickEvents,
            snapshotId!,
            trackingId,
            path,
            device,
            browser,
            clickhouseService,
            metrics
          );
        }

        if (rageClickEvents.length > 0) {
          results.rageClicks = await processRageClickEvents(
            rageClickEvents,
            snapshotId!,
            trackingId,
            path,
            device,
            browser,
            clickhouseService,
            metrics
          );
        }

        return results;
      });

      if (!results.clicks || !results.rageClicks) {
        console.error("Failed to insert some events into ClickHouse");
        return c.json({ success: false, error: "Database error" }, 500);
      }

      return c.json(
        {
          success: true,
          processed: {
            clicks: clickEvents.length,
            rageClicks: rageClickEvents.length,
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
