import { cache } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

export type ClickInfos = {
  tracking_id: string;
  url: string;
  timestamp: string;
  device: string;
  visible: boolean;
  erx: number;
  ery: number;
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
  first_click_rank: number | null;
};

export const addClicks = cache(
  async (
    supabase: SupabaseClient,
    clickInfos: ClickInfos[]
  ): Promise<ClickInfos[] | null> => {
    const { data, error } = await supabase.from("clicks").insert(clickInfos);
    if (error) {
      console.log("Error inserting click:", error);
      return null;
    }

    return data;
  }
);

export type Click = Omit<
  ClickInfos,
  | "tracking_id"
  | "url"
  | "timestamp"
  | "user_agent"
  | "device"
  | "visible"
  | "first_click_rank"
>;

export const getClicks = cache(
  async (
    supabase: SupabaseClient,
    trackingId: string,
    url: string,
    device: string,
    timestamp: string
  ): Promise<Click[] | null> => {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select("erx, ery, s, l, t, w, h")
      .eq("tracking_id", trackingId)
      .eq("url", url)
      .eq("device", device)
      .gte("timestamp", timestamp);

    if (error) {
      console.log("Error fetching clicks:", error);
      return null;
    }

    return clicks;
  }
);

export type Snapshot = {
  url: string;
  label: string;
  device: string;
  dom_data: string;
  layout_hash: string;
  screenshot_url: string;
  width: number;
  height: number;
  tracking_id: string;
};

export const addSnapshot = cache(
  async (
    supabase: SupabaseClient,
    snapshot: Snapshot
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .insert(snapshot)
      .select("id")
      .single();

    if (error) {
      console.log("Error inserting snapshot:", error);
      return null;
    }
    console.log("Snapshot inserted:", data);

    return data.id;
  }
);

export const getSnapshot = cache(
  async (
    supabase: SupabaseClient,
    id: string
  ): Promise<Omit<
    Snapshot,
    "layout_hash" | "tracking_id" | "dom_data"
  > | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("url, label, device, screenshot_url, width, height")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error fetching snapshot:", error);
      return null;
    }

    return data;
  }
);

export const doesSnapshotExist = cache(
  async (
    supabase: SupabaseClient,
    trackingId: string,
    url: string,
    device: string
  ): Promise<boolean> => {
    const { count, error } = await supabase
      .from("snapshots")
      .select("id", { count: "exact", head: true })
      .eq("tracking_id", trackingId)
      .eq("url", url)
      .eq("device", device);

    if (error) {
      console.log("Error checking if snapshot exists:", error);
      return false;
    }

    return count ? count > 0 : false;
  }
);

export const getSnapshotDomData = cache(
  async (supabase: SupabaseClient, id: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("dom_data")
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error fetching snapshot:", error);
      return null;
    }

    return data.dom_data;
  }
);

export const getSnapshotIdAndDomData = cache(
  async (
    supabase: SupabaseClient,
    trackingId: string,
    url: string,
    device: string
  ): Promise<{ id: string; dom_data: string } | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("id, dom_data")
      .eq("tracking_id", trackingId)
      .eq("url", url)
      .eq("device", device)
      .single();

    if (error) {
      console.log("Error fetching snapshot id:", error);
      return null;
    }

    return data;
  }
);

export type UploadScreenshotInfos = {
  userId: string;
  layoutHash: string;
  buffer: Uint8Array;
};

export const uploadScreenshot = cache(
  async (
    supabase: SupabaseClient,
    uploadInfos: UploadScreenshotInfos
  ): Promise<string | null> => {
    const fileName = `${uploadInfos.userId}/screenshot-${
      uploadInfos.layoutHash
    }-${Date.now()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, uploadInfos.buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.log("Error uploading screenshot:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
);

export type SnapshotInfos = Omit<
  Snapshot,
  | "dom_data"
  | "layout_hash"
  | "screenshot_url"
  | "width"
  | "height"
  | "tracking_id"
> & {
  created_at: string;
  id: string;
};

export const getSnapshotsInfos = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<SnapshotInfos[] | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("id, url, label, device, created_at")
      .eq("user_id", userId);

    if (error) {
      console.log("Error fetching snapshot:", error);
      return null;
    }

    return data;
  }
);

export const getTrackingId = cache(
  async (supabase: SupabaseClient, userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("tracking_ids")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("Error getting tracking ID:", error);
      return null;
    }

    return data.id;
  }
);

export type ClickedElement = {
  snapshot_id: string;
  s: string;
  l: number;
  t: number;
  w: number;
  h: number;
  clicks_count: number;
};

export const addClickedElements = async (
  supabase: SupabaseClient,
  clickedElements: ClickedElement[]
) => {
  const { error } = await supabase
    .from("clicked_elements")
    .insert(clickedElements);

  if (error) {
    console.log("Error inserting snapshot:", error);
    return error;
  }
};

export type AggregatedClick = {
  snapshot_id: string;
  grid_x: number;
  grid_y: number;
  count: number;
  last_updated_at: string;
};

export const addAggregatedClicks = async (
  supabase: SupabaseClient,
  aggregatedClicks: AggregatedClick[]
) => {
  const { error } = await supabase.rpc("upsert_aggregated_clicks", {
    clicks: aggregatedClicks,
  });

  if (error) {
    console.log("Error in upsert_aggregated_clicks RPC:", error);
  }
};

export const getAggregatedClicks = cache(
  async (
    supabase: SupabaseClient,
    snapshotId: string
  ): Promise<AggregatedClick[] | null> => {
    const { data, error } = await supabase
      .from("aggregated_clicks")
      .select("*")
      .eq("snapshot_id", snapshotId);

    if (error) {
      console.log("Error fetching aggregated clicks:", error);
      return null;
    }

    return data;
  }
);
