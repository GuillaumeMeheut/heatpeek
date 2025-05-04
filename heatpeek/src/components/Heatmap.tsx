"use client";

import { useEffect, useRef } from "react";
import simpleheat from "simpleheat";

interface HeatmapProps {
  width?: number;
  height?: number;
  points?: Array<[number, number, number]>;
}

export default function Heatmap({
  width = 800,
  height = 600,
  points = [
    [100, 100, 1],
    [100, 100, 1],
    [200, 200, 1],
    [300, 300, 1],
    [400, 400, 1],
    [500, 500, 1],
  ],
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<ReturnType<typeof simpleheat> | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Initialize simpleheat
        heatmapRef.current = simpleheat(canvas);

        // Set the data points
        heatmapRef.current.data(points);

        // Draw the heatmap
        heatmapRef.current.draw();
      }
    }
  }, [points]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border rounded-lg"
      />
    </div>
  );
}
