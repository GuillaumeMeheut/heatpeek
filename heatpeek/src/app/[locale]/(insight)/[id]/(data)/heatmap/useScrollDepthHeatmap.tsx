import { useEffect, useMemo } from "react";
import { ScrollDepth } from "@/lib/clickhouse/queries";
import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import { palette } from "./utils";

const colorScale = scaleLinear<string>()
  .domain([0, 0.25, 0.5, 0.75, 1])
  .range(palette)
  .interpolate(interpolateRgb);

export default function useScrollDepthHeatmap(
  data: ScrollDepth[],
  containerDimensions: { width: number; height: number } | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  overlayOpacity: number
) {
  const { cumulativeViews, maxCumulative } = useMemo(() => {
    const viewMap = new Map<number, number>();
    data.forEach((d) => viewMap.set(d.scroll_depth, d.views));
    const cumulativeViews: number[] = [];
    for (let depth = 0; depth <= 1000; depth++) {
      let sum = 0;
      const bucket = Math.floor(depth / 10);
      for (let d = bucket; d <= 100; d++) {
        sum += viewMap.get(d) || 0;
      }
      cumulativeViews[depth] = sum;
    }
    const maxCumulative = Math.max(...cumulativeViews, 1);
    return { cumulativeViews, maxCumulative };
  }, [data]);

  // Draw the heatmap only when data, dimensions, or overlayOpacity change
  useEffect(() => {
    if (!data.length || !containerDimensions || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { height, width } = containerDimensions;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = overlayOpacity;

    for (let i = 0; i < height; i++) {
      // Map pixel row to scroll depth (0-1000)
      const scrollPercent = Math.round((i / height) * 1000);
      const cumViews = cumulativeViews[scrollPercent] || 0;
      const normalized = cumViews / maxCumulative;
      const color = colorScale(normalized);
      ctx.fillStyle = color;
      ctx.fillRect(0, i, width, 1);
    }
    ctx.globalAlpha = 1;
  }, [
    data,
    containerDimensions,
    canvasRef,
    overlayOpacity,
    cumulativeViews,
    maxCumulative,
  ]);

  return { cumulativeViews, maxCumulative };
}
