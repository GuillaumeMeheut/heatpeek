"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeatmapSnapshot } from "@/lib/supabase/queries";
import {
  AggregatedClick,
  RawClick,
  ScrollDepth,
} from "@/lib/clickhouse/queries";
import useClickHeatmap from "./useClickHeatmap";
import useScrollHeatmap from "./useScrollDepthHeatmap";
import React from "react";
import ScrollDepthOverlay from "./ScrollDepthOverlay";
import { isClickData, isScrollData } from "./utils";
import { HeatmapType } from "./types";

type HeatmapProps = {
  data: AggregatedClick[] | RawClick[] | ScrollDepth[];
  pageData: HeatmapSnapshot;
  dataType: HeatmapType;
  clickType?: "aggregated" | "raw";
  overlayOpacity: number;
};

export default function Heatmap({
  data,
  pageData,
  dataType,
  clickType = "aggregated",
  overlayOpacity,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useClickHeatmap(
    isClickData(data, dataType) ? data : [],
    containerDimensions,
    pageData,
    clickType,
    canvasRef
  );

  const { cumulativeViews, maxCumulative } = useScrollHeatmap(
    isScrollData(data, dataType) ? data : [],
    containerDimensions,
    canvasRef,
    overlayOpacity
  );

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

          {dataType !== HeatmapType.ScrollDepth && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `rgba(0,0,0,${overlayOpacity})`,
                width: containerDimensions.width,
                height: containerDimensions.height,
              }}
            />
          )}

          {/* Overlay for scroll depth hover */}
          {dataType === HeatmapType.ScrollDepth && (
            <ScrollDepthOverlay
              containerDimensions={containerDimensions}
              cumulativeViews={cumulativeViews}
              maxCumulative={maxCumulative}
            />
          )}

          <canvas
            ref={canvasRef}
            width={containerDimensions.width}
            height={containerDimensions.height}
            className="absolute inset-0 z-30 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
