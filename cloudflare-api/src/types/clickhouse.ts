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
  os: string;
  inserted_at: string;
};

export type RageClickEvent = {
  snapshot_id: string;
  tracking_id: string;
  path: string;
  device: string;
  selector: string;
  erx: number;
  ery: number;
  browser: string;
  os: string;
  inserted_at: string;
};

export type ScrollDepthEvent = {
  snapshot_id: string;
  tracking_id: string;
  path: string;
  device: string;
  browser: string;
  inserted_at: string;
  scroll_depth_percentage: number;
};

export type PageViewEvent = {
  snapshot_id: string;
  tracking_id: string;
  path: string;
  device: string;
  browser: string;
  os: string;
  timestamp: string; // DateTime in ISO format
  is_bounce: boolean;
};

export type EventType = "click" | "rage_click" | "scroll_depth" | "page_view";

export type BaseEvent = {
  type: EventType;
  timestamp: string;
};

export type ClickEvent = BaseEvent & {
  type: "click";
  selector: string;
  erx: number;
  ery: number;
};

export type RageClickEventData = BaseEvent & {
  type: "rage_click";
  selector: string;
  erx: number;
  ery: number;
};

export type ScrollDepthEventData = BaseEvent & {
  type: "scroll_depth";
  scroll_depth_percentage: number;
};

export type PageViewEventData = BaseEvent & {
  type: "page_view";
  is_bounce: boolean;
};

export type MultiEvent =
  | ClickEvent
  | RageClickEventData
  | ScrollDepthEventData
  | PageViewEventData;
