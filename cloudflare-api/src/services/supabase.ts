import { createClient } from "@supabase/supabase-js";
import {
  PageConfigRow,
  PlansRow,
  SnapshotsRow,
  UserProfileRow,
} from "../types/database";
import { snapshotKey } from "../KV/key";

export type ProjectConfigResult = {
  base_url: string;
  is_active: boolean;
  page_config: {
    path: string;
    exclude_el: string[] | null;
    privacy_el: string[] | null;
    update_snap_desktop: boolean;
    update_snap_tablet: boolean;
    update_snap_mobile: boolean;
  } | null;
};

export enum SupabaseError {
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

  async getProjectConfigByPath(
    trackingId: string,
    path: string
  ): Promise<ProjectConfigResult | SupabaseError> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select(
          `
          base_url,
          is_active,
          usage_exceeded,
          page_config (
            path,
            exclude_el,
            privacy_el,
            update_snap_desktop,
            update_snap_tablet,
            update_snap_mobile
          )
        `
        )
        .eq("tracking_id", trackingId)
        // no filter on page_config.path here, do it after fetch
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return SupabaseError.NOT_FOUND;
        }
        console.error("Supabase error getProjectConfig:", error);
        return SupabaseError.FETCH_ERROR;
      }

      if (!data) {
        return SupabaseError.NOT_FOUND;
      }

      // data.page_config is an array (maybe empty)
      const pageConfig =
        (data.page_config || []).find((pc) => pc.path === path) ?? null;

      return {
        base_url: data.base_url,
        is_active: data.is_active && !data.usage_exceeded,
        page_config: pageConfig,
      };
    } catch (error) {
      console.error("Unexpected error getProjectConfig:", error);
      return SupabaseError.FETCH_ERROR;
    }
  }

  async getSnapshotId(
    trackingId: string,
    path: string,
    device: string
  ): Promise<string | SupabaseError> {
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
        return SupabaseError.NOT_FOUND;
      }
      console.error("Supabase error getSnapshotId:", error);
      return SupabaseError.FETCH_ERROR;
    }

    if (!data?.id) {
      return SupabaseError.NOT_FOUND;
    }

    return data.id;
  }

  async getSnapshotIdsBulk(
    items: { trackingId: string; path: string; device: string }[]
  ): Promise<Map<string, string | null>> {
    if (!items.length) return new Map();

    // Deduplicate based on KV-safe keys
    const uniqueKeys = new Map<
      string,
      { trackingId: string; path: string; device: string }
    >();
    for (const i of items) {
      const key = snapshotKey(i.trackingId, i.path, i.device);
      if (!uniqueKeys.has(key)) {
        uniqueKeys.set(key, i);
      }
    }

    const uniqueItems = Array.from(uniqueKeys.values());

    // Bulk query from Supabase
    const { data, error } = await this.supabase
      .from("snapshots")
      .select(
        `
        id,
        device,
        urls!inner(
          tracking_id,
          path
        )
      `
      )
      .eq("is_outdated", false)
      .in(
        "device",
        uniqueItems.map((i) => i.device)
      )
      .in(
        "urls.tracking_id",
        uniqueItems.map((i) => i.trackingId)
      )
      .in(
        "urls.path",
        uniqueItems.map((i) => i.path)
      );

    if (error) {
      console.error("Supabase error getSnapshotIdsBulk:", error);
      // Return null for all keys if query fails
      return new Map(Array.from(uniqueKeys.keys()).map((k) => [k, null]));
    }

    // Create a map with KV-safe keys
    const resultMap = new Map<string, string | null>();
    for (const row of data || []) {
      // @ts-ignore
      const key = snapshotKey(row.urls.tracking_id, row.urls.path, row.device);
      resultMap.set(key, row.id);
    }

    // Fill in missing keys as null
    for (const key of uniqueKeys.keys()) {
      if (!resultMap.has(key)) {
        resultMap.set(key, null);
      }
    }

    return resultMap;
  }

  async getSnapshotInfos(
    trackingId: string,
    path: string,
    device: string
  ): Promise<{ should_update: boolean; url_id: string }> {
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
      console.error("Error fetching snapshot infos:", error);
      throw new Error(error.message);
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

  async getUsersWithActiveSubscription(): Promise<
    Pick<
      UserProfileRow,
      "id" | "subscription_current_period_end" | "current_plan"
    >[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("id, subscription_current_period_end, current_plan")
        .in("subscription_status", ["active", "trialing"]);

      if (error) {
        console.error("Supabase error getUsersWithActiveSubscription:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Unexpected error getUsersWithActiveSubscription:", error);
      throw new Error(error as string);
    }
  }

  async getProjectsByUserIds(
    userIds: string[]
  ): Promise<{ user_id: string; tracking_id: string }[]> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("user_id, tracking_id")
        .in("user_id", userIds);

      if (error) {
        console.error("Supabase error getProjectsByUserIds:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Unexpected error getProjectsByUserIds:", error);
      throw new Error(error as string);
    }
  }
  async getPlans(): Promise<Pick<PlansRow, "id" | "pageviews_limit">[]> {
    try {
      const { data, error } = await this.supabase
        .from("plans")
        .select("id,pageviews_limit");

      if (error) {
        console.error("Supabase error getPlans:", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Unexpected error getPlans:", error);
      throw new Error(error as string);
    }
  }

  async markProjectAsUsageExceeded(trackingIds: string[]): Promise<void> {
    try {
      if (trackingIds.length === 0) return;

      const { error } = await this.supabase
        .from("projects")
        .update({ usage_exceeded: true, is_active: false })
        .in("tracking_id", trackingIds);

      if (error) {
        console.error("Supabase error markProjectAsUsageExceeded:", error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Unexpected error markProjectAsUsageExceeded:", error);
      throw new Error(error as string);
    }
  }
}
