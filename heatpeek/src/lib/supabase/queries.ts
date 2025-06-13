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
  async (supabase: SupabaseClient, clickInfos: ClickInfos[]): Promise<void> => {
    const { error } = await supabase.from("clicks").insert(clickInfos);
    if (error) {
      throw new Error("Error inserting click : ", error);
    }
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

export type Url = {
  id: string;
  path: string;
  label: string;
};

export const getUrls = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<Url[] | null> => {
    const { data, error } = await supabase
      .from("urls")
      .select("id, path, label")
      .eq("project_id", projectId);

    if (error) {
      console.log("Error fetching urls:", error);
      return null;
    }

    return data;
  }
);

export type Snapshot = {
  id: string;
  label: string;
  device: string;
  dom_data: string;
  layout_hash: string;
  screenshot_url: string;
  width: number;
  height: number;
  url_id: string;
  should_update: boolean;
};

export const addSnapshot = cache(
  async (
    supabase: SupabaseClient,
    snapshot: Omit<
      Snapshot,
      | "id"
      | "screenshot_url"
      | "width"
      | "height"
      | "dom_data"
      | "layout_hash"
      | "should_update"
    >
  ): Promise<void> => {
    const { error } = await supabase.from("snapshots").insert(snapshot);

    if (error) {
      throw new Error("Error inserting snapshot:", error);
    }
  }
);

export const updateSnapshot = cache(
  async (
    supabase: SupabaseClient,
    urlId: string,
    snapshot: Partial<Snapshot>
  ): Promise<string | null> => {
    const { error } = await supabase
      .from("snapshots")
      .update(snapshot)
      .eq("url_id", urlId)
      .eq("is_outdated", false);

    if (error) {
      console.log("Error updating snapshot:", error);
      return null;
    }

    return "success";
  }
);

export const getSnapshot = cache(
  async (
    supabase: SupabaseClient,
    projectId: string,
    url: string,
    device: string
  ): Promise<Omit<
    Snapshot,
    "layout_hash" | "dom_data" | "device" | "should_update"
  > | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select(
        `id, 
        label, 
        screenshot_url, 
        width, 
        height, 
        url_id,
        urls (
          path, 
          project_id
        )
      `
      )
      .eq("urls.project_id", projectId)
      .eq("urls.path", url)
      .eq("device", device)
      .eq("is_outdated", false)
      .single();

    if (error) {
      console.log("Error fetching snapshot:", error);
      return null;
    }

    return data;
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
      .select(
        `
        id,
        dom_data,
        urls (
          tracking_id,
          path
        )
      `
      )
      .eq("urls.tracking_id", trackingId)
      .eq("urls.path", url)
      .eq("device", device)
      .eq("is_outdated", false)
      .single();

    if (error) {
      console.log("Error fetching snapshot id:", error);
      return null;
    }

    return data;
  }
);

export type UploadScreenshotInfos = {
  urlId: string;
  layoutHash: string;
  buffer: Uint8Array;
};

export const uploadScreenshot = cache(
  async (
    supabase: SupabaseClient,
    uploadInfos: UploadScreenshotInfos
  ): Promise<string | null> => {
    const fileName = `${uploadInfos.urlId}/${uploadInfos.layoutHash}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, uploadInfos.buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading screenshot:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
);

export const getSnapshotInfos = cache(
  async (
    supabase: SupabaseClient,
    trackingId: string,
    url: string,
    device: string
  ): Promise<{ should_update: boolean; url_id: string } | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select(
        `should_update, url_id,
        urls (
          tracking_id
        )
      `
      )
      .eq("urls.tracking_id", trackingId)
      .eq("urls.path", url)
      .eq("device", device)
      .eq("is_outdated", false)
      .single();

    if (error) {
      console.log("Error fetching snapshot id:", error);
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
): Promise<void> => {
  const { error } = await supabase
    .from("clicked_elements")
    .insert(clickedElements);

  if (error) {
    throw new Error("Error inserting clicked elements:", error);
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

export type PageConfig = {
  id: string;
  path: string;
  created_at: string;
  ignored_el: string[];
  privacy_el: string[];
  url_id: string;
  update_snap: boolean;
};

export const updatePageConfig = cache(
  async (
    supabase: SupabaseClient,
    urlId: string,
    pageConfig: Partial<PageConfig>
  ): Promise<string | null> => {
    const { error } = await supabase
      .from("page_config")
      .update(pageConfig)
      .eq("url_id", urlId);

    if (error) {
      console.log("Error updating page config:", error);
      return null;
    }

    return "success";
  }
);
