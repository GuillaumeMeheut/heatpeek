import { cache } from "react";
import {
  UrlsRow,
  PageConfigRow,
  SnapshotsRow,
  ProjectsRow,
  UrlsInsert,
  PageConfigInsert,
  PageConfigUpdate,
  UrlsUpdate,
  ProjectsInsert,
  ProjectConfigInsert,
  ProjectsUpdate,
  UserProfileRow,
} from "@/types/database";
import { createClient } from "./server";

type SupabaseClient = ReturnType<typeof createClient>;

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

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
  "id" | "path" | "label" | "tracking_id"
> & {
  page_config: Pick<PageConfigRow, "id">;
};

export const getUrlsAndConfig = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<UrlAndConfig[] | null> => {
    const { data, error } = await supabase
      .from("urls")
      .select(
        `
        id,
        path,
        label,
        tracking_id,
        page_config (
          id
        )
      `
      )
      .eq("project_id", projectId);

    if (error) {
      console.log("Error fetching urls:", error);
      return null;
    }

    return data as unknown as UrlAndConfig[];
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

export const getActiveSnapshot = cache(
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

export const getSnapshotById = cache(
  async (
    supabase: SupabaseClient,
    snapshotId: string
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
      .eq("id", snapshotId)
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
    const fileName = `${uploadInfos.urlId}/${uploadInfos.layoutHash}.png`;

    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, uploadInfos.buffer, {
        contentType: "image/png",
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

export const getCustomerDetails = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<Pick<
    UserProfileRow,
    "stripe_customer_id" | "current_plan" | "subscription_status"
  > | null> => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id, current_plan, subscription_status")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error getting customer ID:", error);
      throw new Error("Failed to get customer ID");
    }
    return data;
  }
);

export const getUserPlanLimits = async (
  supabase: SupabaseClient,
  userId: string
): Promise<{
  pageviews_limit: number;
  max_websites: number;
  max_total_tracked_pages: number;
  data_retention_days: number;
} | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      `
        subscription_status,
        plans:current_plan (
          pageviews_limit,
          max_websites,
          max_total_tracked_pages,
          data_retention_days
        )
      `
    )
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user plan limits:", error);
    throw new Error("Failed to fetch user plan limits");
  }

  // If subscription_status is not 'active' or 'trialing', user is limited
  if (
    !data ||
    (data.subscription_status !== "active" &&
      data.subscription_status !== "trialing")
  ) {
    return null;
  }

  // Supabase sometimes returns an array for joined tables, so handle that
  if (Array.isArray(data.plans)) {
    return data.plans[0] ?? null;
  }
  return data.plans ?? null;
};

export const getTotalTrackedPages = async (
  supabase: SupabaseClient,
  userId: string
): Promise<number | null> => {
  const { count, error } = await supabase
    .from("urls")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user total tracked pages:", error);
    throw new Error("Failed to fetch user total tracked pages");
  }

  return count;
};

export const getTotalProjects = async (
  supabase: SupabaseClient,
  userId: string
): Promise<number | null> => {
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user total tracked websites:", error);
    throw new Error("Failed to fetch user total tracked websites");
  }

  return count;
};
