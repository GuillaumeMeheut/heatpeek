import { SnapshotInfos } from "@/lib/supabase/queries";
import { useEffect, useRef } from "react";

interface VisibleElement {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
}

export default function DebugBoundingBoxes({
  pageData,
  width,
  height,
  visibleElement,
}: {
  pageData: SnapshotInfos;
  width: number;
  height: number;
  visibleElement: VisibleElement[];
}) {
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (debugCanvasRef.current && pageData) {
      const canvas = debugCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 1;

        const scaleX = width / pageData.width;
        const scaleY = height / pageData.height;

        visibleElement.forEach((element) => {
          const { l, t, w, h } = element;
          ctx.strokeRect(l * scaleX, t * scaleY, w * scaleX, h * scaleY);
        });
      }
    }
  }, [pageData, width, height, visibleElement]);

  return (
    <canvas
      ref={debugCanvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ zIndex: 2, pointerEvents: "none" }}
    />
  );
}
