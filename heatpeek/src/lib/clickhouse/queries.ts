import { createClient } from "@clickhouse/client-web";

const createClickhouseClient = () => {
  return createClient({
    url: process.env.CLICKHOUSE_URL!,
    username: process.env.CLICKHOUSE_USERNAME!,
    password: process.env.CLICKHOUSE_PASSWORD!,
  });
};

type GetClicksParams = {
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
  snapshotId,
  device,
  browser,
}: GetClicksParams): Promise<RawClick[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`snapshot_id = {snapshotId:UUID}`];
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
      snapshotId,
      device,
      browser,
    },
  });

  const rows = await resultSet.json();
  return rows.data as RawClick[];
};

export const getRageClicks = async ({
  snapshotId,
  device,
  browser,
}: GetClicksParams): Promise<RawClick[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`snapshot_id = {snapshotId:UUID}`];
  if (device) conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
    SELECT erx,ery,selector
    FROM rage_raw_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
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
  snapshotId,
  device,
  browser,
}: GetClicksParams): Promise<ScrollDepth[]> => {
  const client = createClickhouseClient();

  const conditions: string[] = [`snapshot_id = {snapshotId:UUID}`];
  if (device) conditions.push(`device = {device:String}`);
  if (browser) conditions.push(`browser = {browser:String}`);

  const query = `
  SELECT
    scroll_depth,
    sum(views) AS total_views
  FROM aggregated_scroll_depth
  WHERE ${conditions.join(" AND ")}
  GROUP BY scroll_depth
`;

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: {
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
