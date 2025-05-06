import { useEffect, useRef } from "react";

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

export default function DebugBoundingBoxes({
  pageData,
  width,
  height,
}: {
  pageData?: PageData;
  width: number;
  height: number;
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

        const scaleX = width / pageData.metadata.dimensions.width;
        const scaleY = height / pageData.metadata.dimensions.height;

        pageData.domData.visibleElements.forEach((element) => {
          const {
            left,
            top,
            width: boxWidth,
            height: boxHeight,
          } = element.boundingBox;
          ctx.strokeRect(
            left * scaleX,
            top * scaleY,
            boxWidth * scaleX,
            boxHeight * scaleY
          );
        });
      }
    }
  }, [pageData, width, height]);

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
