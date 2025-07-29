import { createClient } from "@clickhouse/client-web";
import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";
import { FilterDateEnum } from "@/components/Filters/types";

const createClickhouseClient = () => {
  return createClient({
    url: process.env.CLICKHOUSE_URL!,
    username: process.env.CLICKHOUSE_USERNAME!,
    password: process.env.CLICKHOUSE_PASSWORD!,
  });
};

type GetClicksParams = {
  trackingId: string;
  path: string;
  snapshotId: string;
  device?: string;
  browser?: string;
};

type GetRageClicksParams = {
  trackingId: string;
  path: string;
  snapshotId: string;
  device?: string;
  browser?: string;
};

type GetScrollDepthParams = {
  trackingId: string;
  path: string;
  snapshotId: string;
  device?: string;
  browser?: string;
};

export type RawClick = {
  erx: number;
  ery: number;
  selector: string;
};

export const getClicks = async ({
  trackingId,
  path,
  snapshotId,
  device,
  browser,
}: GetClicksParams): Promise<RawClick[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [
    `tracking_id = {trackingId:String}`,
    `path = {path:String}`,
    `snapshot_id = {snapshotId:UUID}`,
  ];
  if (device) conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
    SELECT erx,ery,selector
    FROM raw_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      snapshotId,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  return rows.data as RawClick[];
};

export const getRageClicks = async ({
  trackingId,
  path,
  snapshotId,
  device,
  browser,
}: GetRageClicksParams): Promise<RawClick[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [
    `tracking_id = {trackingId:String}`,
    `path = {path:String}`,
    `snapshot_id = {snapshotId:UUID}`,
  ];
  if (device) conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
    SELECT erx,ery,selector
    FROM raw_rage_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      snapshotId,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  return rows.data as RawClick[];
};

type RawScrollDepthRow = {
  scroll_depth: number;
  total_views: string;
};

export type ScrollDepth = {
  scroll_depth: number;
  views: number;
};

export const getScrollDepth = async ({
  trackingId,
  path,
  snapshotId,
  device,
  browser,
}: GetScrollDepthParams): Promise<ScrollDepth[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [
    `tracking_id = {trackingId:String}`,
    `path = {path:String}`,
    `snapshot_id = {snapshotId:UUID}`,
  ];
  if (device) conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
 SELECT
  scroll_depth,
  count() AS total_views
  FROM raw_scroll_depth
  WHERE ${conditions.join(" AND ")}
  GROUP BY scroll_depth
`;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      snapshotId,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();

  return (rows.data as RawScrollDepthRow[]).map((row) => ({
    scroll_depth: Number(row.scroll_depth),
    views: Number(row.total_views),
  })) as ScrollDepth[];
};

export const getPageViews = async ({
  trackingId,
  path,
  device,
  browser,
}: {
  trackingId: string;
  path: string;
  device?: DeviceEnum | "all";
  browser?: string;
}): Promise<number> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`tracking_id = {trackingId:String}`];

  if (path && path !== "all") conditions.push(`path = {path:String}`);
  if (device && device !== "all") conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
    SELECT sum(views) AS total_views
    FROM aggregated_pageviews
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  const data = rows.data as { total_views?: string | number }[];
  return Number(data?.[0]?.total_views) || 0;
};

export const getPageViewsTimeseries = async ({
  trackingId,
  path,
  device,
  browser,
  dateRange,
}: {
  trackingId: string;
  path: string;
  device?: DeviceEnum | "all";
  browser?: string;
  dateRange: FilterDateEnum;
}) => {
  const client = createClickhouseClient();

  const conditions: string[] = [`tracking_id = {trackingId:String}`];
  if (path && path !== "all") conditions.push(`path = {path:String}`);
  if (device && device !== "all") conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  // Determine grouping & date filter
  let groupExpr = "";
  let dateCondition = "";
  let tableName = "";
  let aggregationExpr = "";

  switch (dateRange) {
    case FilterDateEnum.Last24Hours:
      groupExpr = "toStartOfHour(timestamp) AS period";
      dateCondition = "timestamp >= now() - INTERVAL 24 HOUR";
      tableName = "raw_pageviews";
      aggregationExpr = "count() AS total_views";
      break;
    case FilterDateEnum.Last7Days:
      groupExpr = "toDate(date) AS period";
      dateCondition = "date >= now() - INTERVAL 7 DAY";
      tableName = "aggregated_pageviews";
      aggregationExpr = "sum(views) AS total_views";
      break;
    case FilterDateEnum.Last30Days:
      groupExpr = "toDate(date) AS period";
      dateCondition = "date >= now() - INTERVAL 30 DAY";
      tableName = "aggregated_pageviews";
      aggregationExpr = "sum(views) AS total_views";
      break;
    case FilterDateEnum.Last90Days:
      groupExpr = "toStartOfMonth(date) AS period";
      dateCondition = "date >= now() - INTERVAL 90 DAY";
      tableName = "aggregated_pageviews";
      aggregationExpr = "sum(views) AS total_views";
      break;
    default:
      throw new Error(`Invalid date range: ${dateRange}`);
  }
  conditions.push(dateCondition);

  const query = `
    SELECT 
      ${groupExpr},
      ${aggregationExpr}
    FROM ${tableName}
    WHERE ${conditions.join(" AND ")}
    GROUP BY period
    ORDER BY period ASC
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: { trackingId, path, device, browser },
  });

  const rows = await resultSet.json();
  return (rows.data as { period: string; total_views: string | number }[]).map(
    (r) => ({
      date: r.period,
      pageViews: Number(r.total_views),
    })
  );
};

export const getClickCount = async ({
  trackingId,
  path,
  device,
  browser,
}: {
  trackingId: string;
  path: string;
  device?: DeviceEnum | "all";
  browser?: string;
}): Promise<number> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`tracking_id = {trackingId:String}`];

  if (path && path !== "all") conditions.push(`path = {path:String}`);
  if (device && device !== "all") conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
    SELECT count() AS click_count
    FROM raw_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  const data = rows.data as { click_count?: string | number }[];
  return Number(data?.[0]?.click_count) || 0;
};

export const getAverageScrollDepth = async ({
  trackingId,
  path,
  device,
  browser,
}: {
  trackingId: string;
  path: string;
  device?: DeviceEnum | "all";
  browser?: string;
}): Promise<number> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`tracking_id = {trackingId:String}`];
  if (path && path !== "all") conditions.push(`path = {path:String}`);
  if (device && device !== "all") conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
   SELECT
      round(avg(scroll_depth), 2) AS avg_scroll_depth
          FROM raw_scroll_depth
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  const data = rows.data as { avg_scroll_depth?: string | number }[];
  return Number(data?.[0]?.avg_scroll_depth) || 0;
};

export const getAverageTimeOnPage = async ({
  trackingId,
  path,
  device,
  browser,
}: {
  trackingId: string;
  path: string;
  device?: DeviceEnum | "all";
  browser?: string;
}): Promise<number> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`tracking_id = {trackingId:String}`];
  if (path && path !== "all") conditions.push(`path = {path:String}`);
  if (device && device !== "all") conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
   SELECT
      round(avg(duration), 0) AS avg_time_on_page
          FROM raw_times_on_page
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
      trackingId,
      path,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  const data = rows.data as { avg_time_on_page?: string | number }[];
  return Number(data?.[0]?.avg_time_on_page) || 0;
};
