"use client";

import { useEffect, useState } from "react";
import Heatmap from "./Heatmap";
import { OptionsBar } from "./OptionsBar";
import { HeatmapSnapshot } from "@/lib/supabase/queries";
import { RawClick, ScrollDepth } from "@/lib/clickhouse/queries";
import { HeatmapType, ParsedDomDataType } from "./types";
import { ClickedElement } from "./utils";

type HeatmapWithOptionsProps = {
  data: RawClick[] | ScrollDepth[];
  type: HeatmapType;
  pageData: HeatmapSnapshot;
  clickedElements: ClickedElement[];
  parsedDomData: ParsedDomDataType;
};

export default function HeatmapWithOptions({
  data,
  type,
  pageData,
  clickedElements,
  parsedDomData,
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
        overlayOpacity={opacity / 100}
        clickedElements={clickedElements}
        parsedDomData={parsedDomData}
      />
      <OptionsBar
        opacity={opacity}
        onOpacityChange={setOpacity}
        activeType={type}
      />
    </div>
  );
}
