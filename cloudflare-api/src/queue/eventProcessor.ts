import type { Env } from "../env";
import { ClickHouseService } from "../services/clickhouse";
import { ClickHouseError } from "../types/clickhouse";
import { getSnapshotCache, setSnapshotCache, snapshotKey } from "../KV/key";
import { SupabaseService } from "../services/supabase";
import {
  createPerformanceTracker,
  finalizeMetrics,
  logPerformance,
} from "../utils";
import {
  ExtendedPageViewEvent,
  ExtendedClickEvent,
  ExtendedRageClickEvent,
  ExtendedScrollDepthEvent,
  ExtendedEngagementEvent,
  QueueEventMessage,
} from "../types/clickhouse";

export async function processBatchEvents(
  messages: QueueEventMessage[],
  env: Env
): Promise<void> {
  const metrics = createPerformanceTracker();
  if (!messages?.length) return;

  const {
    CLICKHOUSE_URL,
    CLICKHOUSE_USERNAME,
    CLICKHOUSE_PASSWORD,
    CACHE_HEATPEEK,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = env;

  const supabaseService = new SupabaseService(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );
  const clickhouseService = new ClickHouseService(
    CLICKHOUSE_URL,
    CLICKHOUSE_USERNAME,
    CLICKHOUSE_PASSWORD
  );

  try {
    // 1️⃣ Collect events and snapshot keys
    const allPageviews: ExtendedPageViewEvent[] = [];
    const allClicks: ExtendedClickEvent[] = [];
    const allRageClicks: ExtendedRageClickEvent[] = [];
    const allScrolls: ExtendedScrollDepthEvent[] = [];
    const allEngagements: ExtendedEngagementEvent[] = [];

    const snapshotKeySet = new Set<string>();
    const snapshotMeta = new Map<
      string,
      { trackingId: string; path: string; device: string }
    >();

    for (const { data } of messages) {
      const { trackingId, path, browser, device, os, events } = data;
      if (!trackingId || !path || !device || !events?.length) continue;

      const key = snapshotKey(trackingId, path, device);
      snapshotKeySet.add(key);
      snapshotMeta.set(key, { trackingId, path, device });

      for (const event of events) {
        const baseMeta = { trackingId, path, browser, device, os };
        switch (event.type) {
          case "page_view":
            allPageviews.push({ ...event, ...baseMeta });
            break;
          case "click":
            allClicks.push({ ...event, ...baseMeta });
            break;
          case "rage_click":
            allRageClicks.push({ ...event, ...baseMeta });
            break;
          case "scroll_depth":
            allScrolls.push({ ...event, ...baseMeta });
            break;
          case "engagement":
            allEngagements.push({ ...event, ...baseMeta });
            break;
        }
      }
    }

    // 2️⃣ Resolve snapshot IDs (KV → Supabase bulk fallback)
    const snapshotCacheMap = new Map<string, string>();

    // Check KV first
    await Promise.all(
      Array.from(snapshotKeySet).map(async (key) => {
        const meta = snapshotMeta.get(key)!;
        const cachedId = await getSnapshotCache(
          meta.trackingId,
          meta.path,
          meta.device,
          CACHE_HEATPEEK
        );
        if (cachedId) snapshotCacheMap.set(key, cachedId);
      })
    );

    // Supabase for cache misses
    const missing = Array.from(snapshotKeySet).filter(
      (key) => !snapshotCacheMap.has(key)
    );
    if (missing.length) {
      const itemsToFetch = missing
        .map((key) => snapshotMeta.get(key))
        .filter(
          (
            meta
          ): meta is { trackingId: string; path: string; device: string } =>
            meta !== undefined
        );

      if (itemsToFetch.length > 0) {
        const fetched = await supabaseService.getSnapshotIdsBulk(itemsToFetch);
        fetched.forEach((snapshotId, key) => {
          if (snapshotId) {
            snapshotCacheMap.set(key, snapshotId);
            const meta = snapshotMeta.get(key);
            if (meta) {
              setSnapshotCache(
                meta.trackingId,
                meta.path,
                meta.device,
                snapshotId,
                CACHE_HEATPEEK
              );
            }
          }
        });
      }
    }

    // 3️⃣ Build rows for ClickHouse (skip events without snapshot IDs)
    const pageviewRows = allPageviews.map((e) => ({
      snapshot_id: snapshotCacheMap.get(
        snapshotKey(e.trackingId, e.path, e.device)
      ),
      tracking_id: e.trackingId,
      path: e.path,
      device: e.device,
      browser: e.browser,
      os: e.os,
      referrer: e.referrer,
      is_bounce: e.is_bounce,
      timestamp: e.timestamp,
    }));

    const clickRows = allClicks
      .map((e) => ({
        snapshot_id: snapshotCacheMap.get(
          snapshotKey(e.trackingId, e.path, e.device)
        ),
        tracking_id: e.trackingId,
        path: e.path,
        device: e.device,
        browser: e.browser,
        os: e.os,
        selector: e.selector,
        erx: e.erx,
        ery: e.ery,
        timestamp: e.timestamp,
      }))
      .filter((row): row is typeof row & { snapshot_id: string } =>
        Boolean(row.snapshot_id)
      );

    const rageClickRows = allRageClicks
      .map((e) => ({
        snapshot_id: snapshotCacheMap.get(
          snapshotKey(e.trackingId, e.path, e.device)
        ),
        tracking_id: e.trackingId,
        path: e.path,
        device: e.device,
        browser: e.browser,
        os: e.os,
        selector: e.selector,
        erx: e.erx,
        ery: e.ery,
        timestamp: e.timestamp,
      }))
      .filter((row): row is typeof row & { snapshot_id: string } =>
        Boolean(row.snapshot_id)
      );

    const scrollRows = allScrolls.map((e) => ({
      snapshot_id: snapshotCacheMap.get(
        snapshotKey(e.trackingId, e.path, e.device)
      ),
      tracking_id: e.trackingId,
      path: e.path,
      device: e.device,
      browser: e.browser,
      os: e.os,
      scroll_depth: e.sd,
      timestamp: e.timestamp,
    }));

    const engagementRows = allEngagements.map((e) => ({
      snapshot_id: snapshotCacheMap.get(
        snapshotKey(e.trackingId, e.path, e.device)
      ),
      tracking_id: e.trackingId,
      path: e.path,
      device: e.device,
      browser: e.browser,
      os: e.os,
      duration: e.e,
      timestamp: e.timestamp,
    }));

    // 4️⃣ Insert by type (isolated failures)
    const results = await Promise.allSettled([
      clickhouseService.insertPageViews(pageviewRows),
      clickhouseService.insertClicks(clickRows),
      clickhouseService.insertRageClicks(rageClickRows),
      clickhouseService.insertScrollDepth(scrollRows),
      clickhouseService.insertEngagement(engagementRows),
    ]);

    const tableNames = [
      "pageviews",
      "clicks",
      "rageClicks",
      "scrollDepth",
      "engagement",
    ];
    results.forEach((res, idx) => {
      if (
        res.status === "rejected" ||
        res.value === ClickHouseError.QUERY_ERROR
      ) {
        console.error(`Insert failed for ${tableNames[idx]}`);
      }
    });

    console.log("Processed batch:", {
      pageviews: pageviewRows.length,
      clicks: clickRows.length,
      rageClicks: rageClickRows.length,
      scrollDepth: scrollRows.length,
      engagement: engagementRows.length,
    });
  } catch (err) {
    console.error("Batch processing error:", err);
  } finally {
    await clickhouseService.close();
    logPerformance(finalizeMetrics(metrics), "QUEUE batch");
  }
}
