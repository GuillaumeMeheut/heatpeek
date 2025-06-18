export type SupabaseProjectConfigResponse = Array<{
  id: string;
  usageExceeded: boolean;
  page_config: Array<{
    path: string;
    ignored_el: string[] | null;
    privacy_el: string[] | null;
    update_snap_desktop: boolean;
    update_snap_tablet: boolean;
    update_snap_mobile: boolean;
  }>;
}>;
