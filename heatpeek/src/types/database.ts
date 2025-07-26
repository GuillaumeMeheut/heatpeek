import { Database } from "./supabase";

//To update when supabase schema changes
//npx supabase gen types typescript --project-id rkrkpchutofbpyqvniqq > src/types/supabase.ts

// Table Row Types
export type PageConfigRow = Database["public"]["Tables"]["page_config"]["Row"];
export type ProjectConfigRow =
  Database["public"]["Tables"]["project_config"]["Row"];
export type ProjectsRow = Database["public"]["Tables"]["projects"]["Row"];
export type SnapshotsRow = Database["public"]["Tables"]["snapshots"]["Row"];
export type UrlsRow = Database["public"]["Tables"]["urls"]["Row"];
export type UserProfileRow =
  Database["public"]["Tables"]["user_profiles"]["Row"];

// Table Insert Types
export type PageConfigInsert =
  Database["public"]["Tables"]["page_config"]["Insert"];
export type ProjectConfigInsert =
  Database["public"]["Tables"]["project_config"]["Insert"];
export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type SnapshotsInsert =
  Database["public"]["Tables"]["snapshots"]["Insert"];
export type UrlsInsert = Database["public"]["Tables"]["urls"]["Insert"];
export type UserProfileInsert =
  Database["public"]["Tables"]["user_profiles"]["Insert"];

// Table Update Types
export type PageConfigUpdate =
  Database["public"]["Tables"]["page_config"]["Update"];
export type ProjectConfigUpdate =
  Database["public"]["Tables"]["project_config"]["Update"];
export type ProjectsUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type SnapshotsUpdate =
  Database["public"]["Tables"]["snapshots"]["Update"];
export type UrlsUpdate = Database["public"]["Tables"]["urls"]["Update"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];

//Enum Types
export type Device = Database["public"]["Enums"]["device"];
