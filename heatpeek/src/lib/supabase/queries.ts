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

export const addSnapshots = cache(
  async (
    supabase: SupabaseClient,
    snapshots: Snapshot[]
  ): Promise<string | null> => {
    const { data, error } = await supabase.from("snapshots").insert(snapshots);

    if (error) {
      console.log("Error inserting snapshot:", error);
      return null;
    }
    console.log("Snapshot inserted:", data);

    return "success";
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

export const uploadScreenshots = cache(
  async (
    supabase: SupabaseClient,
    uploadInfos: UploadScreenshotInfos[]
  ): Promise<Record<string, string | null>> => {
    const results: Record<string, string | null> = {};

    for (const info of uploadInfos) {
      const fileName = `${info.userId}/screenshot-${
        info.layoutHash
      }-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(fileName, info.buffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.log("Error uploading screenshot:", uploadError);
        results[info.layoutHash] = null;
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("screenshots")
        .getPublicUrl(fileName);

      results[info.layoutHash] = publicUrlData.publicUrl;
    }

    return results;
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

export const getTrackingIdAndBaseUrl = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<{ tracking_id: string; base_url: string } | null> => {
    const { data, error } = await supabase
      .from("projects")
      .select("tracking_id, base_url")
      .eq("id", projectId)
      .single();

    if (error) {
      console.log("Error getting tracking ID:", error);
      return null;
    }

    return data;
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

export type Project = {
  id: string;
  label: string;
  base_url: string;
  type: string | null;
  created_at: string;
};

export const getProjects = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<Project[] | null> => {
    console.log("Fetching projects for user:", userId);

    const { data, error } = await supabase
      .from("projects")
      .select("id, label, base_url, type, created_at")
      .eq("user_id", userId);

    if (error) {
      console.log("Error fetching projects:", error);
      return null;
    }

    return data;
  }
);

export const deleteProject = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<{ success: boolean } | null> => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      return null;
    }

    return { success: true };
  }
);
