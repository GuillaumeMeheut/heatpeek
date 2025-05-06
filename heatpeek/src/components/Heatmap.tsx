"use client";

import { useEffect, useRef, useMemo } from "react";
import simpleheat from "simpleheat";
import DebugBoundingBoxes from "./DebugBoundingBoxes";

interface Click {
  relative_x: number;
  relative_y: number;
  screen_width: number;
  screen_height: number;
  bbox_left?: number;
  bbox_top?: number;
  bbox_width?: number;
  bbox_height?: number;
  selector?: string;
  element_relative_x?: number;
  element_relative_y?: number;
}

interface VisibleElement {
  selector: string;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  text: string;
}

interface PageData {
  screenshotUrl: string;
  domData: {
    htmlSnapshot: string;
    visibleElements: VisibleElement[];
  };
  metadata: {
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
    timestamp: string;
    layoutHash: string;
  };
}

interface HeatmapProps {
  width: number;
  height: number;
  clicks: Click[];
  pageData?: PageData;
}

export default function Heatmap({
  width,
  height,
  clicks,
  pageData,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<ReturnType<typeof simpleheat> | null>(null);

  // Calculate points with intensity based on clustering (element-based)
  const points = useMemo(() => {
    if (clicks.length === 0 || !pageData) return [];

    // Calculate scaling factors
    const scaleX = width / pageData.metadata.dimensions.width;
    const scaleY = height / pageData.metadata.dimensions.height;

    // Group clicks by their exact position (rounded to cluster precision)
    const clusters = new Map<string, { count: number; x: number; y: number }>();
    const CLUSTER_PRECISION = 5; // pixels

    clicks.forEach((click) => {
      let x: number;
      let y: number;

      // Try to find the element that was clicked using the selector
      if (click.selector) {
        const element = pageData.domData.visibleElements.find(
          (el) => el.selector === click.selector
        );

        if (
          element &&
          click.element_relative_x !== undefined &&
          click.element_relative_y !== undefined
        ) {
          // Use the element-relative position to calculate the absolute position
          // This is more accurate as it uses the position relative to the element at click time
          x =
            (element.boundingBox.left +
              click.element_relative_x * element.boundingBox.width) *
            scaleX;
          y =
            (element.boundingBox.top +
              click.element_relative_y * element.boundingBox.height) *
            scaleY;
        } else if (
          click.bbox_left !== undefined &&
          click.bbox_top !== undefined
        ) {
          // Fallback to using the bounding box position if element-relative position is not available
          x = click.bbox_left * scaleX;
          y = click.bbox_top * scaleY;
        } else {
          // Final fallback to relative positioning
          x = click.relative_x * pageData.metadata.dimensions.width * scaleX;
          y = click.relative_y * pageData.metadata.dimensions.height * scaleY;
        }
      } else {
        // No selector available, use relative positioning
        x = click.relative_x * pageData.metadata.dimensions.width * scaleX;
        y = click.relative_y * pageData.metadata.dimensions.height * scaleY;
      }

      // Round to cluster precision
      x = Math.round(x / CLUSTER_PRECISION) * CLUSTER_PRECISION;
      y = Math.round(y / CLUSTER_PRECISION) * CLUSTER_PRECISION;

      const key = `${x},${y}`;
      if (!clusters.has(key)) {
        clusters.set(key, { count: 1, x, y });
      } else {
        const entry = clusters.get(key)!;
        entry.count++;
      }
    });

    // Convert clusters to points with intensity
    return Array.from(clusters.values()).map(({ x, y, count }) => {
      const intensity = Math.log2(count + 1) * 2;
      return [x, y, intensity] as [number, number, number];
    });
  }, [clicks, width, height, pageData]);

  useEffect(() => {
    if (canvasRef.current && points.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Initialize simpleheat
        heatmapRef.current = simpleheat(canvas);

        // Set the data points
        heatmapRef.current.data(points);

        // Configure heatmap settings
        heatmapRef.current.radius(20, 25); // min and max radius
        heatmapRef.current.max(10); // maximum intensity

        // Draw the heatmap
        heatmapRef.current.draw();
      }
    }
  }, [points]);

  return (
    <div className="relative">
      <div className="relative" style={{ width, height }}>
        {/* Background Image */}
        {pageData?.screenshotUrl && (
          <img
            src={pageData.screenshotUrl}
            alt="Page screenshot"
            className="absolute inset-0"
            style={{ width, height }}
          />
        )}
        {/* Black overlay with 70% opacity */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.7)",
            width,
            height,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <DebugBoundingBoxes pageData={pageData} width={width} height={height} />
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0"
          style={{ zIndex: 3 }}
        />
      </div>
    </div>
  );
}
