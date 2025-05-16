"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import Image from "next/image";
import simpleheat from "simpleheat";
import DebugBoundingBoxes from "../../components/DebugBoundingBoxes";
import { Click, SnapshotInfos } from "@/lib/supabase/queries";

type VisibleElement = {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
};

type HeatmapProps = {
  clicks: Click[];
  pageData: SnapshotInfos;
  visibleElement: VisibleElement[];
};

const HEATMAP_CONFIG = {
  GRID_SIZE: 20,
  RADIUS: {
    MIN: 20,
    MAX: 25,
  },
  MAX_INTENSITY: 10,
  OVERLAY_OPACITY: 0.7,
} as const;

export default function Heatmap({
  clicks,
  pageData,
  visibleElement,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<ReturnType<typeof simpleheat> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = pageData.height / pageData.width;

        // Calculate the maximum possible width based on the container and original dimensions
        const maxPossibleWidth = Math.min(2000, pageData.width);

        // If the container is wider than our max width, use the max width
        // Otherwise, use the container width
        const newWidth =
          containerWidth > maxPossibleWidth ? maxPossibleWidth : containerWidth;
        const newHeight = Math.round(newWidth * aspectRatio);

        setContainerDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [pageData]);

  // Calculate points with intensity based on grid-based aggregation
  const points = useMemo(() => {
    if (clicks.length === 0 || !pageData || !containerDimensions) return [];

    // Calculate scaling factors
    const scaleX = containerDimensions.width / pageData.width;
    const scaleY = containerDimensions.height / pageData.height;

    const grid = new Map<string, { count: number; x: number; y: number }>();

    clicks.forEach((click) => {
      let x = 0;
      let y = 0;

      // Try to find the element that was clicked using the selector
      if (click.s) {
        const element = visibleElement.find((el) => el.s === click.s);

        if (element && click.erx !== undefined && click.ery !== undefined) {
          // Use the element-relative position to calculate the absolute position
          x = (element.l + click.erx * element.w) * scaleX;
          y = (element.t + click.ery * element.h) * scaleY;
        } else if (click.l !== undefined && click.t !== undefined) {
          // Fallback to using the bounding box position
          x = click.l * scaleX;
          y = click.t * scaleY;
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
      if (!grid.has(key)) {
        grid.set(key, { count: 1, x: gridX, y: gridY });
      } else {
        const entry = grid.get(key)!;
        entry.count++;
      }
    });

    // Convert grid to points with intensity
    return Array.from(grid.values()).map(({ x, y, count }) => {
      const intensity = Math.log2(count + 1) * 2;
      return [x, y, intensity] as [number, number, number];
    });
  }, [clicks, containerDimensions, pageData, visibleElement]);

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
  }, [points, containerDimensions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerDimensions?.height ?? "auto" }}
    >
      {containerDimensions && (
        <div
          className="relative mx-auto"
          style={{
            width: containerDimensions.width,
            height: containerDimensions.height,
          }}
        >
          {pageData?.screenshotUrl && (
            <Image
              src={pageData.screenshotUrl}
              alt={`Screenshot of ${pageData.url}`}
              className="absolute inset-0"
              style={{
                width: containerDimensions.width,
                height: containerDimensions.height,
              }}
              width={containerDimensions.width}
              height={containerDimensions.height}
              priority
            />
          )}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `rgba(0,0,0,${HEATMAP_CONFIG.OVERLAY_OPACITY})`,
              width: containerDimensions.width,
              height: containerDimensions.height,
            }}
          />
          <DebugBoundingBoxes
            pageData={pageData}
            visibleElement={visibleElement}
            width={containerDimensions.width}
            height={containerDimensions.height}
          />
          <canvas
            ref={canvasRef}
            width={containerDimensions.width}
            height={containerDimensions.height}
            className="absolute inset-0 z-20"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
