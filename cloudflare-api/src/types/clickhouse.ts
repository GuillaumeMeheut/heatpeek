export enum ClickHouseError {
  CONNECTION_ERROR = "CONNECTION_ERROR",
  QUERY_ERROR = "QUERY_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  INVALID_DATA = "INVALID_DATA",
}

export type ClickHouseEvent = {
  snapshot_id: string;
  tracking_id: string;
  path: string;
  device: string;
  selector: string;
  erx: number;
  ery: number;
  browser: string;
  inserted_at: string;
};
