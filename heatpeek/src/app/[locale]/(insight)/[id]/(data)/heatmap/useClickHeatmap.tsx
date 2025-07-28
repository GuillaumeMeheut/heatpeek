"use client";

import { useEffect, useMemo, useRef } from "react";
import { HeatmapSnapshot } from "@/lib/supabase/queries";
import simpleheat from "simpleheat";
import { RawClick } from "@/lib/clickhouse/queries";
import { ParsedDomDataType } from "./types";

const HEATMAP_CONFIG = {
  SPACE_TOLERANCE: 2,
  GRID_SIZE: 20,
  RADIUS: {
    MIN: 20,
    MAX: 25,
  },
  MAX_INTENSITY: 10,
} as const;

export default function useClickHeatmap(
  clicks: RawClick[],
  containerDimensions: {
    width: number;
    height: number;
  } | null,
  pageData: HeatmapSnapshot,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  parsedDomData: ParsedDomDataType
) {
  const heatmapRef = useRef<ReturnType<typeof simpleheat> | null>(null);

  // Calculate points with intensity based on aggregated clicks or raw clicks
  const points = useMemo(() => {
    if (
      clicks.length === 0 ||
      !pageData ||
      !containerDimensions ||
      !pageData.width ||
      !pageData.height
    )
      return [];

    // Calculate scaling factors
    const scaleX = containerDimensions.width / pageData.width;
    const scaleY = containerDimensions.height / pageData.height;

    const rawClicks = clicks as RawClick[];

    // Parse DOM data to get element positions
    let domElements: Map<
      string,
      { l: number; t: number; w: number; h: number }
    > | null = null;

    try {
      domElements = new Map(parsedDomData.map((el) => [el.s, el]));
    } catch (error) {
      console.error("Error mapping DOM data:", error);
      return [];
    }

    if (!domElements) {
      console.warn("No DOM data available for raw clicks");
      return [];
    }

    // Group clicks by position to calculate intensity
    const clickGroups = new Map<
      string,
      { x: number; y: number; count: number }
    >();

    for (const click of rawClicks) {
      const element = domElements.get(click.selector);
      if (!element) continue;

      // Calculate absolute position using raw values
      const x = element.l + click.erx * element.w;
      const y = element.t + click.ery * element.h;

      // Use raw position for grouping (with small tolerance for exact matches)
      const tolerance = HEATMAP_CONFIG.SPACE_TOLERANCE;
      const roundedX = Math.round(x / tolerance) * tolerance;
      const roundedY = Math.round(y / tolerance) * tolerance;
      const key = `${roundedX},${roundedY}`;

      const existing = clickGroups.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        clickGroups.set(key, { x, y, count: 1 });
      }
    }

    return Array.from(clickGroups.values()).map(({ x, y, count }) => {
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const intensity = Math.log2(count + 1) * 2;
      return [scaledX, scaledY, intensity] as [number, number, number];
    });
  }, [clicks, containerDimensions, pageData, parsedDomData]);

  useEffect(() => {
    if (canvasRef.current && points.length > 0 && containerDimensions) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        heatmapRef.current = simpleheat(canvas);

        heatmapRef.current.data(points);

        heatmapRef.current.radius(
          HEATMAP_CONFIG.RADIUS.MIN,
          HEATMAP_CONFIG.RADIUS.MAX
        );
        heatmapRef.current.max(HEATMAP_CONFIG.MAX_INTENSITY);

        heatmapRef.current.draw();
      }
    } else if (
      canvasRef.current &&
      points.length === 0 &&
      containerDimensions
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [points, containerDimensions, canvasRef]);
}
