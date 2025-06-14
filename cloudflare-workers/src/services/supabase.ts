import type { SupabaseProjectConfigResponse } from "../types/supabase";

export class SupabaseService {
  constructor(
    private readonly supabaseUrl: string,
    private readonly supabaseAnonKey: string
  ) {}

  async getProjectConfig(trackingId: string, path: string) {
    const apiUrl =
      `${this.supabaseUrl}/rest/v1/project_config` +
      `?tracking_id=eq.${encodeURIComponent(trackingId)}` +
      `&select=id,usageExceeded,page_config!inner(path,ignored_el,privacy_el,update_snap)` +
      `&page_config.path=eq.${encodeURIComponent(path)}` +
      `&limit=1`;

    const response = await fetch(apiUrl, {
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SupabaseProjectConfigResponse;
    if (!data.length) {
      return null;
    }

    return {
      id: data[0].id,
      usageExceeded: data[0].usageExceeded,
      page_config: data[0].page_config?.[0] ?? null,
    };
  }
}
