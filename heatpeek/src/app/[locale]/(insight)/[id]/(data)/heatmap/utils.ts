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

export type ClickedElement = {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
  clicks: number;
  rageClicks: number;
  visibilityPercentage: number;
  clickConversionRate: number;
  percentageOfTotalClicks: number;
};

export type DomElement = {
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
};

export function getClickedElements(
  domData: string | null,
  clicks: AggregatedClick[] | RawClick[],
  rageClicks: RawClick[],
  scrollDepth: ScrollDepth[]
): ClickedElement[] {
  if (!domData) {
    return [];
  }

  const clickMap = new Map<string, number>();
  const rageClickMap = new Map<string, number>();

  // Process regular clicks
  for (const item of clicks) {
    if ("selector" in item) {
      const selector = item.selector;
      clickMap.set(selector, (clickMap.get(selector) || 0) + 1);
    }
  }

  // Process rage clicks
  for (const item of rageClicks) {
    if ("selector" in item) {
      const selector = item.selector;
      rageClickMap.set(selector, (rageClickMap.get(selector) || 0) + 1);
    }
  }

  // Calculate total page views from scroll depth data
  const totalPageViews = scrollDepth.reduce((sum, item) => sum + item.views, 0);

  // Calculate total clicks across all elements
  const totalClicks = Array.from(clickMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalRageClicks = Array.from(rageClickMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  const allTotalClicks = totalClicks + totalRageClicks;

  const domElements = JSON.parse(domData) as DomElement[];

  // Calculate visibility percentage for each element based on scroll depth
  const domWithClicks = domElements
    .map((el): ClickedElement => {
      const elementClicks = clickMap.get(el.s) || 0;
      const elementRageClicks = rageClickMap.get(el.s) || 0;

      // Calculate visibility percentage based on element position and scroll depth
      const pageHeight = Math.max(...domElements.map((d) => d.t + d.h));

      // Count views where users scrolled to at least the top of this element
      const viewsPastElement = scrollDepth
        .filter((item) => {
          const scrollDepthPercent = item.scroll_depth; // Already 0-100
          const scrollDepthPixels = (scrollDepthPercent / 100) * pageHeight;
          return scrollDepthPixels >= el.t; // Check if scrolled to element top
        })
        .reduce((sum, item) => sum + item.views, 0);

      const visibilityPercentage =
        totalPageViews > 0 ? (viewsPastElement / totalPageViews) * 100 : 0;

      // Calculate click conversion rate (clicks / views where element was visible)
      const totalElementClicks = elementClicks + elementRageClicks;
      const clickConversionRate =
        viewsPastElement > 0
          ? (totalElementClicks / viewsPastElement) * 100
          : 0;

      // Calculate percentage of total clicks
      const percentageOfTotalClicks =
        allTotalClicks > 0 ? (totalElementClicks / allTotalClicks) * 100 : 0;

      return {
        s: el.s,
        l: el.l,
        t: el.t,
        w: el.w,
        h: el.h,
        clicks: elementClicks,
        rageClicks: elementRageClicks,
        visibilityPercentage: Math.round(visibilityPercentage * 100) / 100, // Round to 2 decimal places
        clickConversionRate: Math.round(clickConversionRate * 100) / 100, // Round to 2 decimal places
        percentageOfTotalClicks:
          Math.round(percentageOfTotalClicks * 100) / 100, // Round to 2 decimal places
      };
    })
    .filter((el) => el.clicks > 0 || el.rageClicks > 0);

  return domWithClicks;
}
