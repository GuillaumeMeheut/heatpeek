import { Database } from "./supabase";

//To update when supabase schema changes
//npx supabase gen types typescript --project-id nopzpxrhrcerdfnecoqd > src/types/supabase.ts

// Table Row Types
export type AggregatedClicksRow =
  Database["public"]["Tables"]["aggregated_clicks"]["Row"];
export type ClickedElementsRow =
  Database["public"]["Tables"]["clicked_elements"]["Row"];
export type ClicksRow = Database["public"]["Tables"]["clicks"]["Row"];
export type PageConfigRow = Database["public"]["Tables"]["page_config"]["Row"];
export type ProjectConfigRow =
  Database["public"]["Tables"]["project_config"]["Row"];
export type ProjectsRow = Database["public"]["Tables"]["projects"]["Row"];
export type SnapshotsRow = Database["public"]["Tables"]["snapshots"]["Row"];
export type UrlsRow = Database["public"]["Tables"]["urls"]["Row"];

// Table Insert Types
export type AggregatedClicksInsert =
  Database["public"]["Tables"]["aggregated_clicks"]["Insert"];
export type ClickedElementsInsert =
  Database["public"]["Tables"]["clicked_elements"]["Insert"];
export type ClicksInsert = Database["public"]["Tables"]["clicks"]["Insert"];
export type PageConfigInsert =
  Database["public"]["Tables"]["page_config"]["Insert"];
export type ProjectConfigInsert =
  Database["public"]["Tables"]["project_config"]["Insert"];
export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type SnapshotsInsert =
  Database["public"]["Tables"]["snapshots"]["Insert"];
export type UrlsInsert = Database["public"]["Tables"]["urls"]["Insert"];

// Table Update Types
export type AggregatedClicksUpdate =
  Database["public"]["Tables"]["aggregated_clicks"]["Update"];
export type ClickedElementsUpdate =
  Database["public"]["Tables"]["clicked_elements"]["Update"];
export type ClicksUpdate = Database["public"]["Tables"]["clicks"]["Update"];
export type PageConfigUpdate =
  Database["public"]["Tables"]["page_config"]["Update"];
export type ProjectConfigUpdate =
  Database["public"]["Tables"]["project_config"]["Update"];
export type ProjectsUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type SnapshotsUpdate =
  Database["public"]["Tables"]["snapshots"]["Update"];
export type UrlsUpdate = Database["public"]["Tables"]["urls"]["Update"];

//Enum Types
export type Device = Database["public"]["Enums"]["device"];
