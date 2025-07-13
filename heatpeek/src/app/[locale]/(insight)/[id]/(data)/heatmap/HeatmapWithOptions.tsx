"use client";

import { useEffect, useState } from "react";
import Heatmap from "./Heatmap";
import { OptionsBar } from "./OptionsBar";
import { HeatmapSnapshot } from "@/lib/supabase/queries";
import {
  AggregatedClick,
  RawClick,
  ScrollDepth,
} from "@/lib/clickhouse/queries";
import { HeatmapType } from "./types";
import { ClickedElement } from "./utils";

type HeatmapWithOptionsProps = {
  data: AggregatedClick[] | RawClick[] | ScrollDepth[];
  type: HeatmapType;
  pageData: HeatmapSnapshot;
  clickType?: "aggregated" | "raw";
  clickedElements: ClickedElement[];
};

export default function HeatmapWithOptions({
  data,
  type,
  pageData,
  clickType = "aggregated",
  clickedElements,
}: HeatmapWithOptionsProps) {
  const [opacity, setOpacity] = useState(40);

  useEffect(() => {
    if (type === HeatmapType.ScrollDepth) {
      setOpacity(90);
    } else {
      setOpacity(40);
    }
  }, [type]);

  return (
    <div className="relative">
      <Heatmap
        data={data}
        pageData={pageData}
        dataType={type}
        clickType={clickType}
        overlayOpacity={opacity / 100}
        clickedElements={clickedElements}
      />
      <OptionsBar
        opacity={opacity}
        onOpacityChange={setOpacity}
        activeType={type}
      />
    </div>
  );
}
