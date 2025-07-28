export enum HeatmapType {
  Clicks = "clicks",
  RageClicks = "rage_clicks",
  ScrollDepth = "scroll_depth",
}

export enum DeviceEnum {
  Desktop = "desktop",
  Tablet = "tablet",
  Mobile = "mobile",
}

export type ParsedDomDataType = Array<{
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
}>;
