import React from "react";

export default function ScrollDepthOverlay({
  containerDimensions,
  cumulativeViews,
  maxCumulative,
}: {
  containerDimensions: { width: number; height: number };
  cumulativeViews: number[];
  maxCumulative: number;
}) {
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);
  const lineRef = React.useRef<HTMLDivElement | null>(null);
  const [hoverPercent, setHoverPercent] = React.useState<number | null>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = Math.max(
      0,
      Math.min(e.clientY - rect.top, containerDimensions.height - 1)
    );
    // Center tooltip horizontally
    const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
    const centerX = containerDimensions.width / 2 - tooltipWidth / 2;
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${centerX}px, ${
        y - 18 < 0 ? y + 8 : y - 18
      }px)`;
      tooltipRef.current.style.display = "block";
    }
    if (lineRef.current) {
      lineRef.current.style.transform = `translateY(${y}px)`;
      lineRef.current.style.display = "block";
    }
    const scrollPercent = Math.round((y / containerDimensions.height) * 1000);
    const cumViews = cumulativeViews[scrollPercent] || 0;
    const percent = (cumViews / maxCumulative) * 100;
    setHoverPercent(percent);
  }

  function handleMouseLeave() {
    if (tooltipRef.current) tooltipRef.current.style.display = "none";
    if (lineRef.current) lineRef.current.style.display = "none";
    setHoverPercent(null);
  }

  return (
    <div
      className="absolute inset-0 z-40"
      style={{
        width: containerDimensions.width,
        height: containerDimensions.height,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseMove}
    >
      <div
        ref={lineRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "2px",
          background: "#222",
          zIndex: 100,
          pointerEvents: "none",
          transform: "translateY(0)",
          display: "none",
        }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 12,
          pointerEvents: "none",
          zIndex: 101,
          transform: "translate(0, 0)",
          display: "none",
        }}
      >
        {hoverPercent !== null
          ? `${hoverPercent.toFixed(1)}% users reached here`
          : ""}
      </div>
    </div>
  );
}
