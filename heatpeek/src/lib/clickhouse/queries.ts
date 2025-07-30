import { createClient } from "@clickhouse/client-web";
import { FilterDateEnum } from "@/components/Filters/types";

// Common types
type BaseQueryParams = {
  trackingId: string;
  path?: string;
  device?: string;
  browser?: string;
  date?: FilterDateEnum;
};

type SnapshotQueryParams = BaseQueryParams & {
  snapshotId: string;
};

const createClickhouseClient = () => {
  return createClient({
    url: process.env.CLICKHOUSE_URL!,
    username: process.env.CLICKHOUSE_USERNAME!,
    password: process.env.CLICKHOUSE_PASSWORD!,
  });
};

const buildConditions = (
  params: BaseQueryParams,
  dateField: "timestamp" | "date" = "timestamp"
): { conditions: string[]; queryParams: Record<string, string | number> } => {
  const conditions: string[] = [`tracking_id = {trackingId:String}`];
  const queryParams: Record<string, string | number> = {
    trackingId: params.trackingId,
  };

  if (params.path) {
    conditions.push(`path = {path:String}`);
    queryParams.path = params.path;
  }
  if (params.device) {
    conditions.push(`device = {device:String}`);
    queryParams.device = params.device;
  }
  if (params.browser) {
    conditions.push(`browser = {browser:String}`);
    queryParams.browser = params.browser;
  }

  // Add date range filtering based on FilterDateEnum using the specified date field
  if (params.date) {
    switch (params.date) {
      case FilterDateEnum.Last24Hours:
        conditions.push(`${dateField} >= now() - INTERVAL 24 HOUR`);
        break;
      case FilterDateEnum.Last7Days:
        conditions.push(`${dateField} >= now() - INTERVAL 7 DAY`);
        break;
      case FilterDateEnum.Last30Days:
        conditions.push(`${dateField} >= now() - INTERVAL 30 DAY`);
        break;
      case FilterDateEnum.Last90Days:
        conditions.push(`${dateField} >= now() - INTERVAL 90 DAY`);
        break;
    }
  }

  return { conditions, queryParams };
};

const executeQuery = async <T>(
  query: string,
  queryParams: Record<string, string | number>
): Promise<T[]> => {
  const client = createClickhouseClient();

  const resultSet = await client.query({
    query,
    format: "JSON",
    query_params: queryParams,
  });
  const rows = await resultSet.json();
  return rows.data as T[];
};

const executeSingleValueQuery = async (
  query: string,
  queryParams: Record<string, string | number>,
  valueKey: string
): Promise<number> => {
  const data = await executeQuery<Record<string, string | number>>(
    query,
    queryParams
  );
  return Number(data?.[0]?.[valueKey]) || 0;
};

// Raw data types
export type RawClick = {
  erx: number;
  ery: number;
  selector: string;
};

type RawScrollDepthRow = {
  scroll_depth: number;
  total_views: string;
};

export type ScrollDepth = {
  scroll_depth: number;
  views: number;
};

// Query functions
export const getClicks = async (
  params: SnapshotQueryParams
): Promise<RawClick[]> => {
  const { conditions, queryParams } = buildConditions(params);
  conditions.push(`snapshot_id = {snapshotId:UUID}`);
  queryParams.snapshotId = params.snapshotId;

  const query = `
    SELECT erx, ery, selector
    FROM raw_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  return executeQuery<RawClick>(query, queryParams);
};

export const getRageClicks = async (
  params: SnapshotQueryParams
): Promise<RawClick[]> => {
  const { conditions, queryParams } = buildConditions(params);
  conditions.push(`snapshot_id = {snapshotId:UUID}`);
  queryParams.snapshotId = params.snapshotId;

  const query = `
    SELECT erx, ery, selector
    FROM raw_rage_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  return executeQuery<RawClick>(query, queryParams);
};

export const getScrollDepth = async (
  params: SnapshotQueryParams
): Promise<ScrollDepth[]> => {
  const { conditions, queryParams } = buildConditions(params);
  conditions.push(`snapshot_id = {snapshotId:UUID}`);
  queryParams.snapshotId = params.snapshotId;

  const query = `
    SELECT
      scroll_depth,
      count() AS total_views
    FROM raw_scroll_depth
    WHERE ${conditions.join(" AND ")}
    GROUP BY scroll_depth
  `;

  const rows = await executeQuery<RawScrollDepthRow>(query, queryParams);
  return rows.map((row) => ({
    scroll_depth: Number(row.scroll_depth),
    views: Number(row.total_views),
  }));
};

// Helper function for pageviews logic
export const getPageViews = async (
  params: BaseQueryParams
): Promise<number> => {
  const { conditions, queryParams } = buildConditions(params, "date");

  const query = `
    SELECT sum(views) AS total_views
    FROM aggregated_pageviews
    WHERE ${conditions.join(" AND ")}
  `;

  return executeSingleValueQuery(query, queryParams, "total_views");
};

export const getPageViewsByBrowser = async (
  params: BaseQueryParams
): Promise<{ browser: string; count: number }[]> => {
  const { conditions, queryParams } = buildConditions(params, "date");

  const query = `
    SELECT browser, sum(views) AS browser_count
    FROM aggregated_pageviews
    WHERE ${conditions.join(" AND ")}
    GROUP BY browser
    ORDER BY browser_count DESC
  `;

  const result = await executeQuery<{
    browser: string;
    browser_count: number;
  }>(query, queryParams);

  return result.map((r) => ({
    browser: r.browser,
    count: Number(r.browser_count),
  }));
};

export const getPageViewsTimeseries = async (params: BaseQueryParams) => {
  const { conditions, queryParams } = buildConditions(params, "date");

  // Determine grouping based on date range
  const groupExpr = getGroupExpr(params.date);

  const query = `
    SELECT 
      ${groupExpr},
      sum(views) AS total_views
    FROM aggregated_pageviews
    WHERE ${conditions.join(" AND ")}
    GROUP BY period
    ORDER BY period ASC
  `;

  const rows = await executeQuery<{
    period: string;
    total_views: string | number;
  }>(query, queryParams);
  return rows.map((r) => ({
    date: r.period,
    pageViews: Number(r.total_views),
  }));
};

const getGroupExpr = (date?: FilterDateEnum) => {
  switch (date) {
    case FilterDateEnum.Last24Hours:
      return "toStartOfHour(date) AS period";
    case FilterDateEnum.Last7Days:
    case FilterDateEnum.Last30Days:
      return "toDate(date) AS period";
    case FilterDateEnum.Last90Days:
      return "toStartOfMonth(date) AS period";
    default:
      return "toDate(date) AS period";
  }
};

export const getClickCount = async (
  params: BaseQueryParams
): Promise<number> => {
  const { conditions, queryParams } = buildConditions(params);

  const query = `
    SELECT count() AS click_count
    FROM raw_clicks
    WHERE ${conditions.join(" AND ")}
  `;

  return executeSingleValueQuery(query, queryParams, "click_count");
};

export const getAverageScrollDepth = async (
  params: BaseQueryParams
): Promise<number> => {
  const { conditions, queryParams } = buildConditions(params);

  const query = `
    SELECT round(avg(scroll_depth), 2) AS avg_scroll_depth
    FROM raw_scroll_depth
    WHERE ${conditions.join(" AND ")}
  `;

  return executeSingleValueQuery(query, queryParams, "avg_scroll_depth");
};

export const getAverageTimeOnPage = async (
  params: BaseQueryParams
): Promise<number> => {
  const { conditions, queryParams } = buildConditions(params);

  const query = `
    SELECT round(avg(duration), 0) AS avg_time_on_page
    FROM raw_times_on_page
    WHERE ${conditions.join(" AND ")}
  `;

  return executeSingleValueQuery(query, queryParams, "avg_time_on_page");
};
