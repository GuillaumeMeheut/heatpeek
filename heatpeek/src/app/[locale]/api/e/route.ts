import {
  addClicks,
  ClickInfos,
  addAggregatedClicks,
  AggregatedClick,
  getSnapshotIdAndDomData,
  addClickedElements,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

const HEATMAP_CONFIG = {
  GRID_SIZE: 20,
} as const;

function aggregateClicksIntoGrid(
  clickDataArray: ClickInfos[],
  snapshotId: string,
  domData: string
): AggregatedClick[] {
  const GRID_SIZE = HEATMAP_CONFIG.GRID_SIZE;
  const HALF_GRID = GRID_SIZE / 2;
  const grid = new Map<string, { count: number; x: number; y: number }>();

  // Parse and index DOM data
  const domElements = new Map(
    (
      JSON.parse(domData) as Array<{
        s: string;
        l: number;
        t: number;
        w: number;
        h: number;
      }>
    ).map((el) => [el.s, el])
  );

  for (const click of clickDataArray) {
    if (!click.s || click.erx === undefined || click.ery === undefined)
      continue;

    const element = domElements.get(click.s);
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

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (
      !payload.trackingId ||
      !payload.url ||
      !payload.device ||
      !Array.isArray(payload.events)
    ) {
      return new Response(
        JSON.stringify({ error: "Missing trackingId or events array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();
    let errorCount = 0;
    const errors = [];
    const clickDataArray: ClickInfos[] = [];

    const snapshot = await getSnapshotIdAndDomData(
      supabase,
      payload.trackingId,
      payload.url,
      payload.device
    );

    if (!snapshot) {
      return new Response(
        JSON.stringify({ error: "No matching snapshot found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const domElements = JSON.parse(snapshot.dom_data) as Array<{
      s: string;
      l: number;
      t: number;
      w: number;
      h: number;
    }>;

    for (const event of payload.events) {
      if (!event.s) {
        errorCount++;
        errors.push({ event, error: "Missing required fields in event" });
        continue;
      }

      // Check if the selector exists in the snapshot
      const hasValidSelector = domElements.some((el) => el.s === event.s);

      if (!hasValidSelector) {
        errorCount++;
        errors.push({ event, error: "No matching element found for selector" });
        continue;
      }

      const clickData: ClickInfos = {
        tracking_id: payload.trackingId,
        url: payload.url,
        erx: event.erx,
        ery: event.ery,
        timestamp: event.timestamp,
        device: payload.device,
        visible: event.visible,
        s: event.s,
        l: event.l,
        t: event.t,
        w: event.w,
        h: event.h,
        first_click_rank: event.firstClickRank,
      };
      clickDataArray.push(clickData);
    }

    let successCount = 0;
    if (clickDataArray.length > 0) {
      try {
        // Store individual clicks
        await addClicks(supabase, clickDataArray);

        const selectorCounts = new Map<string, number>();

        for (const click of clickDataArray) {
          const key = click.s;
          selectorCounts.set(key, (selectorCounts.get(key) ?? 0) + 1);
        }

        // Aggregate and store grid clicks
        const aggregatedClicks = aggregateClicksIntoGrid(
          clickDataArray,
          snapshot.id,
          snapshot.dom_data
        );

        await addAggregatedClicks(supabase, aggregatedClicks);

        const clickedElements = domElements
          .filter((el) => selectorCounts.has(el.s))
          .map((el) => ({
            snapshot_id: snapshot.id,
            s: el.s,
            l: el.l,
            t: el.t,
            w: el.w,
            h: el.h,
            clicks_count: selectorCounts.get(el.s) ?? 0,
          }));

        await addClickedElements(supabase, clickedElements);

        successCount = clickDataArray.length;
      } catch (err) {
        errorCount += clickDataArray.length;
        errors.push({ error: err instanceof Error ? err.message : err });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${successCount} clicks, ${errorCount} errors`,
        errors,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error tracking click:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while processing the request.";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
