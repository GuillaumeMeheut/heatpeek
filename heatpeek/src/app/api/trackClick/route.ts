import {
  addClicks,
  ClickInfos,
  addAggregatedClicks,
  AggregatedClick,
  getSnapshotIdAndDomData,
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
  const grid = new Map<string, { count: number; x: number; y: number }>();

  // Parse the DOM data
  const domElements = JSON.parse(domData) as Array<{
    s: string;
    l: number;
    t: number;
    w: number;
    h: number;
  }>;

  // First, group clicks by their exact position
  const positionGroups = new Map<string, ClickInfos[]>();

  clickDataArray.forEach((click) => {
    let x = 0;
    let y = 0;

    // Try to find the element that was clicked using the selector
    if (click.s) {
      const element = domElements.find((el) => el.s === click.s);

      if (element && click.erx !== undefined && click.ery !== undefined) {
        // Use the element-relative position to calculate the absolute position
        x = element.l + click.erx * element.w;
        y = element.t + click.ery * element.h;
      } else if (click.l !== undefined && click.t !== undefined) {
        // Fallback to using the bounding box position
        x = click.l;
        y = click.t;
      }
    }

    // Round to nearest grid cell
    const gridX =
      Math.floor(x / HEATMAP_CONFIG.GRID_SIZE) * HEATMAP_CONFIG.GRID_SIZE +
      HEATMAP_CONFIG.GRID_SIZE / 2;
    const gridY =
      Math.floor(y / HEATMAP_CONFIG.GRID_SIZE) * HEATMAP_CONFIG.GRID_SIZE +
      HEATMAP_CONFIG.GRID_SIZE / 2;

    const key = `${gridX},${gridY}`;
    if (!positionGroups.has(key)) {
      positionGroups.set(key, [click]);
    } else {
      positionGroups.get(key)!.push(click);
    }
  });

  // Then aggregate the grouped clicks into the grid
  positionGroups.forEach((clicks, key) => {
    const [gridX, gridY] = key.split(",").map(Number);
    grid.set(key, {
      count: clicks.length, // Use the actual number of clicks in this position
      x: gridX,
      y: gridY,
    });
  });

  // Convert grid to aggregated clicks
  return Array.from(grid.entries()).map(([, { x, y, count }]) => {
    return {
      snapshotId,
      gridX: x,
      gridY: y,
      count,
      lastUpdatedAt: new Date().toISOString(),
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Payload tracking click:", payload);

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

    for (const event of payload.events) {
      if (!event.s) {
        errorCount++;
        errors.push({ event, error: "Missing required fields in event" });
        continue;
      }
      const clickData: ClickInfos = {
        trackingId: payload.trackingId,
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
      };
      clickDataArray.push(clickData);
    }

    let successCount = 0;
    if (clickDataArray.length > 0) {
      try {
        // Store individual clicks
        await addClicks(supabase, clickDataArray);

        // Aggregate and store grid clicks
        const snapshots = await getSnapshotIdAndDomData(
          supabase,
          payload.trackingId,
          payload.url,
          payload.device
        );
        if (snapshots && snapshots.length > 0) {
          for (const { id: snapshotId, domData } of snapshots) {
            const aggregatedClicks = aggregateClicksIntoGrid(
              clickDataArray,
              snapshotId,
              domData
            );
            await addAggregatedClicks(supabase, aggregatedClicks);
          }
        }

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
