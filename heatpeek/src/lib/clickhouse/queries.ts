import { createClient } from "@clickhouse/client-web";
import { DeviceEnum } from "@/app/[locale]/(insight)/[id]/(data)/heatmap/types";

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

export type AggregatedClick = {
  grid_x: number;
  grid_y: number;
  count: number;
  last_updated_at: string;
  snapshot_id: string;
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
      round(sum(scroll_depth) / count(), 2) AS avg_scroll_depth
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
