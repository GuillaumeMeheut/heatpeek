import { createClient } from "@supabase/supabase-js";

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
        console.error("Supabase error:", error);
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
      console.error("Unexpected error:", error);
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
      .select("id, urls!inner(tracking_id, path)")
      .eq("is_outdated", false)
      .eq("device", device)
      .eq("urls.tracking_id", trackingId)
      .eq("urls.path", path)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return ProjectConfigError.FETCH_ERROR;
    }

    if (!data?.id) {
      return ProjectConfigError.NOT_FOUND;
    }

    return data.id;
  }
}
