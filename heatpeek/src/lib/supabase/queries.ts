import { cache } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import {
  ClicksRow,
  UrlsRow,
  PageConfigRow,
  SnapshotsRow,
  ClickedElementsRow,
  AggregatedClicksRow,
  ProjectsRow,
  UrlsInsert,
  PageConfigInsert,
  PageConfigUpdate,
  UrlsUpdate,
  ProjectsInsert,
  ProjectConfigInsert,
  ProjectsUpdate,
} from "@/types/database";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

export type ClickInfos = Pick<
  ClicksRow,
  | "tracking_id"
  | "url"
  | "timestamp"
  | "device"
  | "visible"
  | "erx"
  | "ery"
  | "s"
  | "l"
  | "t"
  | "w"
  | "h"
  | "first_click_rank"
>;

export const addClicks = cache(
  async (supabase: SupabaseClient, clickInfos: ClickInfos[]): Promise<void> => {
    const { error } = await supabase.from("clicks").insert(clickInfos);
    if (error) {
      throw new Error("Error inserting click : ", error);
    }
  }
);

export type Click = Pick<
  ClicksRow,
  "erx" | "ery" | "s" | "l" | "t" | "w" | "h"
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

export const addProject = cache(
  async (
    supabase: SupabaseClient,
    project: ProjectsInsert
  ): Promise<string> => {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select("id")
      .single();

    if (error) {
      console.log("Error adding project:", error);
      if (error.code === "23505") {
        throw new Error("Project with this base URL already exists");
      }
      throw new Error("Error adding project");
    }

    return data.id;
  }
);

export const addProjectConfig = cache(
  async (
    supabase: SupabaseClient,
    projectConfig: ProjectConfigInsert
  ): Promise<void> => {
    const { error } = await supabase
      .from("project_config")
      .insert(projectConfig);

    if (error) {
      console.log("Error adding page config:", error);
      throw new Error("Error adding page config");
    }
  }
);

export const updateProject = cache(
  async (
    supabase: SupabaseClient,
    projectId: string,
    project: ProjectsUpdate
  ): Promise<void> => {
    const { error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }
);

export const addUrl = cache(
  async (supabase: SupabaseClient, url: UrlsInsert): Promise<string> => {
    const { data, error } = await supabase
      .from("urls")
      .insert(url)
      .select("id")
      .single();

    if (error) {
      console.log("Error adding url:", error);
      if (error.code === "23505") {
        throw new Error("Url already exists");
      }
      throw new Error("Error adding url");
    }

    return data.id;
  }
);

export const addPageConfig = cache(
  async (
    supabase: SupabaseClient,
    pageConfig: PageConfigInsert
  ): Promise<void> => {
    const { error } = await supabase.from("page_config").insert(pageConfig);

    if (error) {
      console.log("Error adding page config:", error);
      throw new Error("Error adding page config");
    }
  }
);

export type Url = Pick<UrlsRow, "id" | "path" | "label">;

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

export type UrlAndConfig = Pick<
  UrlsRow,
  "id" | "path" | "label" | "views" | "clicks"
> & {
  page_config: Pick<PageConfigRow, "id" | "is_active">;
};

export const getUrlsAndConfig = cache(
  async (
    supabase: SupabaseClient<Database>,
    projectId: string
  ): Promise<UrlAndConfig[] | null> => {
    const { data, error } = await supabase
      .from("urls")
      .select(
        `
        id,
        path,
        label,
        views,
        clicks,
        page_config (
          id,
          is_active
        )
      `
      )
      .eq("project_id", projectId);

    if (error) {
      console.log("Error fetching urls:", error);
      return null;
    }

    return data as UrlAndConfig[];
  }
);

export type Snapshot = Pick<
  SnapshotsRow,
  | "id"
  | "label"
  | "device"
  | "dom_data"
  | "layout_hash"
  | "screenshot_url"
  | "width"
  | "height"
  | "url_id"
  | "should_update"
>;

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
      console.error("Error inserting snapshot:", error);
      throw new Error("Error inserting snapshot");
    }
  }
);

export const addSnapshots = cache(
  async (
    supabase: SupabaseClient,
    snapshots: Omit<
      Snapshot,
      | "id"
      | "screenshot_url"
      | "width"
      | "height"
      | "dom_data"
      | "layout_hash"
      | "should_update"
    >[]
  ): Promise<void> => {
    const { error } = await supabase.from("snapshots").insert(snapshots);

    if (error) {
      console.error("Error inserting snapshot:", error);
      throw new Error("Error inserting snapshot");
    }
  }
);

export const updateSnapshot = cache(
  async (
    supabase: SupabaseClient,
    urlId: string,
    device: string,
    snapshot: Partial<Snapshot>
  ): Promise<string | null> => {
    const { error } = await supabase
      .from("snapshots")
      .update(snapshot)
      .eq("url_id", urlId)
      .eq("is_outdated", false)
      .eq("device", device);

    if (error) {
      console.log("Error updating snapshot:", error);
      return null;
    }

    return "success";
  }
);

export type HeatmapSnapshot = Pick<
  SnapshotsRow,
  "id" | "label" | "screenshot_url" | "width" | "height" | "url_id" | "dom_data"
> & {
  urls: Pick<UrlsRow, "path" | "project_id">;
};

export const getSnapshot = cache(
  async (
    supabase: SupabaseClient,
    projectId: string,
    url: string,
    device: string
  ): Promise<HeatmapSnapshot | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select(
        `id, 
       label, 
       screenshot_url, 
       width, 
       height, 
       url_id,
       dom_data,
       urls!inner (
         path, 
         project_id
       )`
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

    return data as unknown as HeatmapSnapshot;
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
        urls!inner (
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
        urls!inner(
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
      console.log("Error getting tracking ID and base URL:", error);
      return null;
    }

    return data;
  }
);

export const getTrackingId = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from("projects")
      .select("tracking_id")
      .eq("id", projectId)
      .single();

    if (error) {
      console.log("Error getting tracking ID:", error);
      return null;
    }

    return data.tracking_id;
  }
);
export const getProjectConfigId = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<string | null> => {
    const { data, error } = await supabase
      .from("project_config")
      .select("id")
      .eq("project_id", projectId)
      .single();

    if (error) {
      console.log("Error getting project config ID:", error);
      return null;
    }

    return data.id;
  }
);

export type ClickedElement = Pick<
  ClickedElementsRow,
  "snapshot_id" | "s" | "l" | "t" | "w" | "h" | "clicks_count"
>;

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

export type AggregatedClick = Pick<
  AggregatedClicksRow,
  "snapshot_id" | "grid_x" | "grid_y" | "count" | "last_updated_at"
>;

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

export type Project = Pick<
  ProjectsRow,
  "id" | "label" | "base_url" | "type" | "created_at"
>;

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
  async (supabase: SupabaseClient, projectId: string): Promise<void> => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
);

export const deleteUrl = cache(
  async (supabase: SupabaseClient, urlId: string): Promise<void> => {
    const { error } = await supabase.from("urls").delete().eq("id", urlId);

    if (error) {
      console.error("Error deleting url:", error);
      throw new Error("Failed to delete url.");
    }
  }
);

export const updateUrl = cache(
  async (
    supabase: SupabaseClient,
    urlId: string,
    url: UrlsUpdate
  ): Promise<void> => {
    const { error } = await supabase.from("urls").update(url).eq("id", urlId);

    if (error) {
      console.error("Error updating url:", error);
      throw new Error("Failed to update url");
    }
  }
);

export const updatePageConfig = cache(
  async (
    supabase: SupabaseClient,
    urlId: string,
    pageConfig: PageConfigUpdate
  ): Promise<void> => {
    const { error } = await supabase
      .from("page_config")
      .update(pageConfig)
      .eq("url_id", urlId);

    if (error) {
      console.error("Error updating page config:", error);
      throw new Error("Failed to update page config");
    }
  }
);
