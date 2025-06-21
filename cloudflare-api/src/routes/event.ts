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

const router = new Hono<{ Bindings: Env }>();

const EXPIRATION_TTL = 360;

router.post("/click", cors(), async (c) => {
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
      console.error("Error closing ClickHouse connection:", error);
      return c.json({ success: false, error: "Internal error" }, 500);
    }

    try {
      const clickhouseEvents = await measureStep(
        metrics,
        "prepare_events",
        () =>
          events.map((event) => ({
            snapshot_id: snapshotId,
            tracking_id: trackingId,
            path,
            device,
            browser,
            selector: event.s,
            erx: event.erx,
            ery: event.ery,
            inserted_at: new Date().toISOString(),
          }))
      );

      const result = await measureStep(metrics, "insert_clicks", () =>
        clickhouseService.insertClicks(clickhouseEvents)
      );

      if (result === ClickHouseError.QUERY_ERROR) {
        console.error("Failed to insert events into ClickHouse");
        return c.json({ success: false, error: "Database error" }, 500);
      }

      return c.json({ success: true }, 200);
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
    logPerformance(finalMetrics, "POST /click");
  }
});

export default router;
