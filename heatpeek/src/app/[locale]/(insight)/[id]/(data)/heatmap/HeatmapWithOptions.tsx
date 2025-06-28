"use client";

import { useState } from "react";
import Heatmap from "./Heatmap";
import { OptionsBar } from "./OptionsBar";
import { AggregatedClick, HeatmapSnapshot } from "@/lib/supabase/queries";
import { RawClick } from "@/lib/clickhouse/queries";

type HeatmapWithOptionsProps = {
  clicks: AggregatedClick[] | RawClick[];
  pageData: HeatmapSnapshot;
  clickType?: "aggregated" | "raw";
};

export default function HeatmapWithOptions({
  clicks,
  pageData,
  clickType = "aggregated",
}: HeatmapWithOptionsProps) {
  const [opacity, setOpacity] = useState(40);

  return (
    <div className="relative">
      <Heatmap
        clicks={clicks}
        pageData={pageData}
        clickType={clickType}
        overlayOpacity={opacity / 100} // Convert percentage to decimal
      />
      <OptionsBar opacity={opacity} onOpacityChange={setOpacity} />
    </div>
  );
}
