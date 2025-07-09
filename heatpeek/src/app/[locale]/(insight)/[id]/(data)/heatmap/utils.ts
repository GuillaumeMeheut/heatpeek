import {
  AggregatedClick,
  RawClick,
  ScrollDepth,
} from "@/lib/clickhouse/queries";

export const palette = [
  "#DDDEDE", // white (least views)
  "#68F21E", // green
  "#E4F21E", // yellow
  "#F79227", // orange
  "#F21E1E", // red (most views)
];

export function isClickData(
  data: AggregatedClick[] | RawClick[] | ScrollDepth[],
  dataType: "clicks" | "rage_clicks" | "scroll_depth"
): data is AggregatedClick[] | RawClick[] {
  return dataType === "clicks" || dataType === "rage_clicks";
}

export function isScrollData(
  data: AggregatedClick[] | RawClick[] | ScrollDepth[],
  dataType: "clicks" | "rage_clicks" | "scroll_depth"
): data is ScrollDepth[] {
  return dataType === "scroll_depth";
}
