"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import Image from "next/image";
import simpleheat from "simpleheat";
import { AggregatedClick, HeatmapSnapshot } from "@/lib/supabase/queries";

type HeatmapProps = {
  aggregatedClicks: AggregatedClick[];
  pageData: HeatmapSnapshot;
};

const HEATMAP_CONFIG = {
  GRID_SIZE: 20,
  RADIUS: {
    MIN: 20,
    MAX: 25,
  },
  MAX_INTENSITY: 10,
  OVERLAY_OPACITY: 0.4,
} as const;

export default function Heatmap({ aggregatedClicks, pageData }: HeatmapProps) {
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
      if (containerRef.current && pageData.width && pageData.height) {
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

  // Calculate points with intensity based on aggregated clicks
  const points = useMemo(() => {
    if (
      aggregatedClicks.length === 0 ||
      !pageData ||
      !containerDimensions ||
      !pageData.width ||
      !pageData.height
    )
      return [];

    // Calculate scaling factors
    const scaleX = containerDimensions.width / pageData.width;
    const scaleY = containerDimensions.height / pageData.height;

    return aggregatedClicks.map((click) => {
      const x = click.grid_x * scaleX;
      const y = click.grid_y * scaleY;
      const intensity = Math.log2(click.count + 1) * 2;
      return [x, y, intensity] as [number, number, number];
    });
  }, [aggregatedClicks, containerDimensions, pageData]);

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
          {pageData?.screenshot_url && (
            <Image
              src={pageData.screenshot_url}
              alt={`Screenshot of ${pageData.label}`}
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
          <canvas
            ref={canvasRef}
            width={containerDimensions.width}
            height={containerDimensions.height}
            className="absolute inset-0 z-30"
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
