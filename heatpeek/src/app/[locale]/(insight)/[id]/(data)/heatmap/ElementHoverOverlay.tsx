"use client";

import { MousePointerClick, Zap, Eye } from "lucide-react";
import { useEffect, useRef } from "react";
import { ClickedElement } from "./utils";
import { Separator } from "@/components/ui/separator";

// Using the ClickedElement interface from utils instead of defining our own

interface ElementHoverOverlayProps {
  containerDimensions: {
    width: number;
    height: number;
  } | null;
  pageData: {
    width: number | null;
    height: number | null;
  } | null;
  elements: ClickedElement[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ElementHoverOverlay({
  containerDimensions,
  pageData,
  elements,
  canvasRef,
}: ElementHoverOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerDimensions ||
      !pageData ||
      !pageData.width ||
      !pageData.height ||
      !canvasRef.current ||
      !overlayRef.current ||
      !tooltipRef.current ||
      !borderRef.current
    )
      return;

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const tooltip = tooltipRef.current;
    const border = borderRef.current;

    const scaleX = containerDimensions.width / pageData.width;
    const scaleY = containerDimensions.height / pageData.height;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find all elements under the mouse and pick the smallest one
      const hoveredCandidates = elements
        .map((element) => {
          const scaledLeft = element.l * scaleX;
          const scaledTop = element.t * scaleY;
          const scaledWidth = element.w * scaleX;
          const scaledHeight = element.h * scaleY;
          const contains =
            x >= scaledLeft &&
            x <= scaledLeft + scaledWidth &&
            y >= scaledTop &&
            y <= scaledTop + scaledHeight;
          return contains
            ? { element, area: scaledWidth * scaledHeight }
            : null;
        })
        .filter(Boolean) as { element: ClickedElement; area: number }[];

      if (hoveredCandidates.length > 0) {
        // Pick the smallest area (most specific)
        hoveredCandidates.sort((a, b) => a.area - b.area);
        const hoveredElement = hoveredCandidates[0].element;

        // Show overlay and border
        overlay.style.display = "block";
        border.style.display = "block";

        // Position border
        const scaledLeft = hoveredElement.l * scaleX;
        const scaledTop = hoveredElement.t * scaleY;
        const scaledWidth = hoveredElement.w * scaleX;
        const scaledHeight = hoveredElement.h * scaleY;

        border.style.left = `${scaledLeft}px`;
        border.style.top = `${scaledTop}px`;
        border.style.width = `${scaledWidth}px`;
        border.style.height = `${scaledHeight}px`;

        // Show and position tooltip
        tooltip.style.display = "block";
        tooltip.style.left = `${Math.min(
          x + 15,
          containerDimensions.width - 240
        )}px`;
        tooltip.style.top = `${Math.min(
          y + 15,
          containerDimensions.height - 120
        )}px`;

        // Update tooltip content
        const selectorElement = tooltip.querySelector("[data-selector]");
        const clicksElement = tooltip.querySelector("[data-clicks]");
        const rageClicksElement = tooltip.querySelector("[data-rage-clicks]");
        const visibilityElement = tooltip.querySelector("[data-visibility]");
        const conversionElement = tooltip.querySelector("[data-conversion]");
        const totalClicksElement = tooltip.querySelector("[data-total-clicks]");

        if (selectorElement) {
          selectorElement.textContent = hoveredElement.s;
        }
        if (clicksElement) {
          clicksElement.textContent = hoveredElement.clicks.toString();
        }
        if (rageClicksElement) {
          rageClicksElement.textContent = hoveredElement.rageClicks.toString();
        }
        if (visibilityElement) {
          visibilityElement.textContent = `${hoveredElement.visibilityPercentage}%`;
        }
        if (conversionElement) {
          conversionElement.textContent = `${hoveredElement.clickConversionRate}% clicks conversion`;
        }
        if (totalClicksElement) {
          totalClicksElement.textContent = `${hoveredElement.percentageOfTotalClicks}% of all clicks`;
        }
      } else {
        // Hide overlay
        overlay.style.display = "none";
        border.style.display = "none";
        tooltip.style.display = "none";
      }
    };

    const handleMouseLeave = () => {
      overlay.style.display = "none";
      border.style.display = "none";
      tooltip.style.display = "none";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerDimensions, pageData, elements, canvasRef]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none z-40"
      style={{ display: "none" }}
    >
      {/* Border highlight */}
      <div
        ref={borderRef}
        className="absolute border-2 border-blue-500 rounded-md pointer-events-none"
        style={{ display: "none" }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-white text-gray-800 border border-gray-300 rounded-xl shadow-xl p-4 pointer-events-none z-50 text-sm min-w-[240px] max-w-sm"
        style={{ display: "none" }}
      >
        <div className="space-y-2 flex flex-col gap-2 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MousePointerClick className="h-5 w-5 text-green-500" />
              <div className="font-semibold" data-clicks></div>
            </div>

            <div className="flex items-center gap-1">
              <Eye className="h-5 w-5 text-blue-500" />
              <div className="font-semibold" data-visibility></div>
            </div>

            <div className="flex items-center gap-1">
              <Zap className="h-5 w-5 text-red-500" />
              <div className="font-semibold" data-rage-clicks></div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <p data-total-clicks></p>
            <p data-conversion></p>
          </div>
        </div>
      </div>
    </div>
  );
}
