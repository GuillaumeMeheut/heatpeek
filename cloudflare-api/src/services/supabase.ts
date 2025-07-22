import { createClient } from "@supabase/supabase-js";
import { PageConfigRow, SnapshotsRow } from "../types/database";

export type ProjectConfigResult = {
  id: string;
  usageExceeded: boolean;
  page_config: {
    path: string;
    ignored_el: string[] | null;
    privacy_el: string[] | null;
    update_snap_desktop: boolean;
    update_snap_tablet: boolean;
    update_snap_mobile: boolean;
  } | null;
};

export enum ProjectConfigError {
  FETCH_ERROR = "FETCH_ERROR",
  NOT_FOUND = "NOT_FOUND",
}

export class SupabaseService {
  private supabase;

  constructor(
    private readonly supabaseUrl: string,
    private readonly supabaseAnonKey: string,
    private readonly supabaseServiceRoleKey?: string
  ) {
    // Use service role key if provided, otherwise use anonymous key
    const key = this.supabaseServiceRoleKey || this.supabaseAnonKey;
    this.supabase = createClient(this.supabaseUrl, key);
  }

  async getProjectConfig(
    trackingId: string,
    path: string
  ): Promise<ProjectConfigResult | ProjectConfigError> {
    try {
      const { data, error } = await this.supabase
        .from("project_config")
        .select(
          `
          id,
          usageExceeded,
          page_config!inner(
            path,
            ignored_el,
            privacy_el,
            update_snap_desktop,
            update_snap_tablet,
            update_snap_mobile
          )
        `
        )
        .eq("tracking_id", trackingId)
        .eq("page_config.path", path)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ProjectConfigError.NOT_FOUND;
        }
        console.error("Supabase error getProjectConfig:", error);
        return ProjectConfigError.FETCH_ERROR;
      }

      if (!data) {
        return ProjectConfigError.NOT_FOUND;
      }

      const pageConfig = data.page_config?.[0];
      if (!pageConfig) {
        return ProjectConfigError.NOT_FOUND;
      }

      return {
        id: data.id,
        usageExceeded: data.usageExceeded,
        page_config: pageConfig,
      };
    } catch (error) {
      console.error("Unexpected error getProjectConfig:", error);
      return ProjectConfigError.FETCH_ERROR;
    }
  }

  async getSnapshotId(
    trackingId: string,
    path: string,
    device: string
  ): Promise<string | ProjectConfigError> {
    const { data, error } = await this.supabase
      .from("snapshots")
      .select(
        `id, 
        urls!inner(
          tracking_id, 
          path
        )`
      )
      .eq("is_outdated", false)
      .eq("device", device)
      .eq("urls.tracking_id", trackingId)
      .eq("urls.path", path)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return ProjectConfigError.NOT_FOUND;
      }
      console.error("Supabase error getSnapshotId:", error);
      return ProjectConfigError.FETCH_ERROR;
    }

    if (!data?.id) {
      return ProjectConfigError.NOT_FOUND;
    }

    return data.id;
  }
  async getSnapshotInfos(
    trackingId: string,
    path: string,
    device: string
  ): Promise<{ should_update: boolean; url_id: string } | ProjectConfigError> {
    const { data, error } = await this.supabase
      .from("snapshots")
      .select(
        `should_update, url_id,
      urls!inner(
        tracking_id
      )
    `
      )
      .eq("urls.tracking_id", trackingId)
      .eq("urls.path", path)
      .eq("device", device)
      .eq("is_outdated", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return ProjectConfigError.NOT_FOUND;
      }
      console.error("Error fetching snapshot id:", error);
      return ProjectConfigError.FETCH_ERROR;
    }

    return data;
  }

  async updateSnapshot(
    urlId: string,
    device: string,
    snapshot: Partial<SnapshotsRow>
  ): Promise<void> {
    const { error } = await this.supabase
      .from("snapshots")
      .update(snapshot)
      .eq("url_id", urlId)
      .eq("is_outdated", false)
      .eq("device", device);

    if (error) {
      console.log("Error updating snapshot:", error);
      throw new Error("Failed to update snapshot");
    }
  }

  async updatePageConfig(
    urlId: string,
    pageConfig: Partial<PageConfigRow>
  ): Promise<void> {
    const { error } = await this.supabase
      .from("page_config")
      .update(pageConfig)
      .eq("url_id", urlId);

    if (error) {
      console.log("Error updating page config:", error);
      throw new Error("Failed to update page config");
    }
  }

  async uploadScreenshot(
    urlId: string,
    layoutHash: string,
    buffer: Uint8Array
  ): Promise<string> {
    const fileName = `${urlId}/${layoutHash}.png`;

    const { error: uploadError } = await this.supabase.storage
      .from("screenshots")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading screenshot:", uploadError);
      throw new Error("Failed to upload screenshot");
    }

    const { data: publicUrlData } = this.supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}
