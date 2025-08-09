export enum ClickHouseError {
  CONNECTION_ERROR = "CONNECTION_ERROR",
  QUERY_ERROR = "QUERY_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  INVALID_DATA = "INVALID_DATA",
}

// Base type for common fields across all ClickHouse events
export type BaseClickHouseEvent = {
  tracking_id: string;
  path: string;
  device: string;
  browser: string;
  os: string;
  timestamp: string;
};

// Heatmap events require snapshot_id (mandatory)
export type ClickEvent = BaseClickHouseEvent & {
  snapshot_id: string;
  selector: string;
  erx: number;
  ery: number;
};

export type RageClickEvent = BaseClickHouseEvent & {
  snapshot_id: string;
  selector: string;
  erx: number;
  ery: number;
};

export type ScrollDepthEvent = BaseClickHouseEvent & {
  snapshot_id: string;
  scroll_depth: number;
};

// Non-heatmap events have optional snapshot_id
export type EngagementEvent = BaseClickHouseEvent & {
  snapshot_id?: string;
  duration: number;
};

export type PageViewEvent = BaseClickHouseEvent & {
  snapshot_id?: string;
  referrer: string;
  is_bounce: boolean;
};

// Event type constants for better performance
export const EVENT_TYPES = {
  CLICK: "click",
  RAGE_CLICK: "rage_click",
  SCROLL_DEPTH: "scroll_depth",
  ENGAGEMENT: "engagement",
  PAGE_VIEW: "page_view",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// Base type for incoming event data
export type BaseEvent = {
  type: EventType;
  timestamp: string;
};

// Incoming event data types
export type ClickEventData = BaseEvent & {
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
  sd: number;
};

export type EngagementEventData = BaseEvent & {
  type: "engagement";
  e: number;
};

export type PageViewEventData = BaseEvent & {
  type: "page_view";
  is_bounce: boolean;
  referrer: string;
};

// Union type for all incoming events
export type MultiEvent =
  | ClickEventData
  | RageClickEventData
  | ScrollDepthEventData
  | EngagementEventData
  | PageViewEventData;

// Optimized types for batch processing
export type EventMetadata = {
  trackingId: string;
  path: string;
  browser: string;
  device: string;
  os: string;
  timestamp: string;
};

export type BatchedEvent<T> = {
  event: T;
  metadata: EventMetadata;
};

// Type guards for better performance
export const isClickEvent = (event: MultiEvent): event is ClickEventData =>
  event.type === EVENT_TYPES.CLICK;

export const isRageClickEvent = (
  event: MultiEvent
): event is RageClickEventData => event.type === EVENT_TYPES.RAGE_CLICK;

export const isScrollDepthEvent = (
  event: MultiEvent
): event is ScrollDepthEventData => event.type === EVENT_TYPES.SCROLL_DEPTH;

export const isEngagementEvent = (
  event: MultiEvent
): event is EngagementEventData => event.type === EVENT_TYPES.ENGAGEMENT;

export const isPageViewEvent = (
  event: MultiEvent
): event is PageViewEventData => event.type === EVENT_TYPES.PAGE_VIEW;

// Optimized event grouping for batch processing
export type EventGroups = {
  clicks: ClickEventData[];
  rageClicks: RageClickEventData[];
  scrollDepth: ScrollDepthEventData[];
  engagement: EngagementEventData[];
  pageViews: PageViewEventData[];
};

// Type for the queue message with optimized structure
export type QueueEventMessage = {
  type: "event";
  data: EventMetadata & {
    events: MultiEvent[];
  };
};

// Extended types for events with metadata (used in batch processing)
export type ExtendedPageViewEvent = PageViewEventData & EventMetadata;
export type ExtendedClickEvent = ClickEventData & EventMetadata;
export type ExtendedRageClickEvent = RageClickEventData & EventMetadata;
export type ExtendedScrollDepthEvent = ScrollDepthEventData & EventMetadata;
export type ExtendedEngagementEvent = EngagementEventData & EventMetadata;
