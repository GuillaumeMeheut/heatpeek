import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const HEATMAP_CONFIG = {
  GRID_SIZE: 20,
  BATCH_SIZE: 1000,
  MAX_PROCESSING_TIME: 50 * 1000, // 50 seconds max processing time
  MAX_SNAPSHOTS: 3, // Process max 3 snapshots at a time
} as const;

const PROCESSING_WINDOW_MS = 6 * 60 * 60 * 1000;

interface Click {
  erx: number;
  ery: number;
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
  inserted_at: string;
}

interface AggregatedClick {
  snapshot_id: string;
  grid_x: number;
  grid_y: number;
  count: number;
  last_updated_at: string;
}

interface DomElement {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
}

interface ProcessingStats {
  processedClicks: number;
  processedSnapshots: number;
  startTime: number;
}

function checkTimeout(stats: ProcessingStats): boolean {
  return (
    performance.now() - stats.startTime > HEATMAP_CONFIG.MAX_PROCESSING_TIME
  );
}

function aggregateClicksIntoGrid(
  clickDataArray: Click[],
  snapshotId: string,
  domData: Map<string, DomElement>
): AggregatedClick[] {
  const GRID_SIZE = HEATMAP_CONFIG.GRID_SIZE;
  const HALF_GRID = GRID_SIZE / 2;
  const grid = new Map<string, { count: number; x: number; y: number }>();

  for (const click of clickDataArray) {
    if (!click.s || click.erx === undefined || click.ery === undefined)
      continue;

    const element = domData.get(click.s);
    if (!element) continue;

    const x = element.l + click.erx * element.w;
    const y = element.t + click.ery * element.h;

    const gridX = Math.floor(x / GRID_SIZE) * GRID_SIZE + HALF_GRID;
    const gridY = Math.floor(y / GRID_SIZE) * GRID_SIZE + HALF_GRID;
    const key = `${gridX},${gridY}`;

    const entry = grid.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      grid.set(key, { count: 1, x: gridX, y: gridY });
    }
  }

  return Array.from(grid.values()).map(({ x, y, count }) => ({
    snapshot_id: snapshotId,
    grid_x: x,
    grid_y: y,
    count,
    last_updated_at: new Date().toISOString(),
  }));
}

Deno.serve(async (req) => {
  const stats: ProcessingStats = {
    processedClicks: 0,
    processedSnapshots: 0,
    startTime: performance.now(),
  };

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch unprocessed snapshots with a limit
    const { data: snapshots, error: snapshotsError } = await supabase
      .from("snapshots")
      .select("id, dom_data, tracking_id, url, device")
      .lte(
        "last_processed_at",
        new Date(Date.now() - PROCESSING_WINDOW_MS).toISOString()
      )
      .limit(HEATMAP_CONFIG.MAX_SNAPSHOTS);

    if (snapshotsError) {
      console.error("Error fetching snapshots:", snapshotsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch snapshots" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!snapshots?.length) {
      return new Response(
        JSON.stringify({ message: "No snapshots to process" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Process each snapshot
    for (const snapshot of snapshots) {
      if (checkTimeout(stats)) break;

      let hasMoreClicks = true;
      let lastProcessedTimestamp = new Date(
        Date.now() - PROCESSING_WINDOW_MS
      ).toISOString();

      // Parse and index DOM data
      const domElements = new Map(
        (JSON.parse(snapshot.dom_data) as Array<DomElement>).map((el) => [
          el.s,
          el,
        ])
      );

      // Process clicks in batches for this snapshot until no more clicks are found or timeout
      while (hasMoreClicks && !checkTimeout(stats)) {
        // Start a transaction for this batch
        const { data: clicks, error: clicksError } = await supabase
          .from("clicks")
          .select("erx, ery, s, l, t, w, h, inserted_at")
          .eq("tracking_id", snapshot.tracking_id)
          .eq("url", snapshot.url)
          .eq("device", snapshot.device)
          .gte("inserted_at", lastProcessedTimestamp)
          .order("inserted_at", { ascending: true })
          .limit(HEATMAP_CONFIG.BATCH_SIZE);

        if (clicksError) {
          console.error("Error fetching clicks:", clicksError);
          return new Response(
            JSON.stringify({ error: "Failed to fetch clicks" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        if (!clicks?.length) {
          hasMoreClicks = false;
          continue;
        }

        const aggregatedClicks = aggregateClicksIntoGrid(
          clicks,
          snapshot.id,
          domElements
        );

        const { error } = await supabase.rpc("upsert_aggregated_clicks", {
          clicks: aggregatedClicks,
        });

        if (error) {
          console.error("Error in upsert_aggregated_clicks RPC:", error);
        }

        stats.processedClicks += clicks.length;

        // Update the last processed timestamp for the next batch
        lastProcessedTimestamp = clicks[clicks.length - 1].inserted_at;

        // If we got less than the batch size, we've processed all clicks for this snapshot
        if (clicks.length < HEATMAP_CONFIG.BATCH_SIZE) {
          hasMoreClicks = false;
        }
      }

      stats.processedSnapshots++;
    }

    const response = {
      message: checkTimeout(stats)
        ? "Processing timeout - more clicks to process"
        : "Processing completed",
      processedSnapshots: stats.processedSnapshots,
      processedClicks: stats.processedClicks,
      processingTime: performance.now() - stats.startTime,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        stats: {
          processedClicks: stats.processedClicks,
          processedSnapshots: stats.processedSnapshots,
          processingTime: performance.now() - stats.startTime,
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
