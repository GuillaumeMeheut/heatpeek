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
