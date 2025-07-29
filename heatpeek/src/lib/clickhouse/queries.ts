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
  params: BaseQueryParams
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

  // Add date range filtering based on FilterDateEnum using timestamp
  if (params.date) {
    switch (params.date) {
      case FilterDateEnum.Last24Hours:
        conditions.push("timestamp >= now() - INTERVAL 24 HOUR");
        break;
      case FilterDateEnum.Last7Days:
        conditions.push("timestamp >= now() - INTERVAL 7 DAY");
        break;
      case FilterDateEnum.Last30Days:
        conditions.push("timestamp >= now() - INTERVAL 30 DAY");
        break;
      case FilterDateEnum.Last90Days:
        conditions.push("timestamp >= now() - INTERVAL 90 DAY");
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
const getPageViewsConfig = (date?: FilterDateEnum) => {
  switch (date) {
    case FilterDateEnum.Last24Hours:
      return {
        tableName: "raw_pageviews",
        dateCondition: "timestamp >= now() - INTERVAL 24 HOUR",
        aggregationExpr: "count() AS total_views",
        groupExpr: "toStartOfHour(timestamp) AS period",
      };
    case FilterDateEnum.Last7Days:
      return {
        tableName: "aggregated_pageviews",
        dateCondition: "date >= now() - INTERVAL 7 DAY",
        aggregationExpr: "sum(views) AS total_views",
        groupExpr: "toDate(date) AS period",
      };
    case FilterDateEnum.Last30Days:
      return {
        tableName: "aggregated_pageviews",
        dateCondition: "date >= now() - INTERVAL 30 DAY",
        aggregationExpr: "sum(views) AS total_views",
        groupExpr: "toDate(date) AS period",
      };
    case FilterDateEnum.Last90Days:
      return {
        tableName: "aggregated_pageviews",
        dateCondition: "date >= now() - INTERVAL 90 DAY",
        aggregationExpr: "sum(views) AS total_views",
        groupExpr: "toStartOfMonth(date) AS period",
      };
    default:
      // Default to last 24 hours if no date specified
      return {
        tableName: "raw_pageviews",
        dateCondition: "timestamp >= now() - INTERVAL 24 HOUR",
        aggregationExpr: "count() AS total_views",
        groupExpr: "toStartOfHour(timestamp) AS period",
      };
  }
};

export const getPageViews = async (
  params: BaseQueryParams
): Promise<number> => {
  const { conditions, queryParams } = buildConditions(params);

  // Remove any timestamp conditions that were added by buildConditions
  const filteredConditions = conditions.filter(
    (condition) => !condition.includes("timestamp")
  );

  const config = getPageViewsConfig(params.date);
  filteredConditions.push(config.dateCondition);

  const query = `
    SELECT ${config.aggregationExpr}
    FROM ${config.tableName}
    WHERE ${filteredConditions.join(" AND ")}
  `;

  return executeSingleValueQuery(query, queryParams, "total_views");
};

export const getPageViewsTimeseries = async (params: BaseQueryParams) => {
  const { conditions, queryParams } = buildConditions(params);

  // Remove any timestamp conditions that were added by buildConditions
  const filteredConditions = conditions.filter(
    (condition) => !condition.includes("timestamp")
  );

  const config = getPageViewsConfig(params.date);
  filteredConditions.push(config.dateCondition);

  const query = `
    SELECT 
      ${config.groupExpr},
      ${config.aggregationExpr}
    FROM ${config.tableName}
    WHERE ${filteredConditions.join(" AND ")}
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
