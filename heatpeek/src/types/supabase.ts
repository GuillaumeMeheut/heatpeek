export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aggregated_clicks: {
        Row: {
          count: number
          created_at: string
          grid_x: number
          grid_y: number
          id: number
          last_updated_at: string
          snapshot_id: string
        }
        Insert: {
          count: number
          created_at?: string
          grid_x: number
          grid_y: number
          id?: number
          last_updated_at: string
          snapshot_id: string
        }
        Update: {
          count?: number
          created_at?: string
          grid_x?: number
          grid_y?: number
          id?: number
          last_updated_at?: string
          snapshot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aggregated_clicks_snapshotId_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      clicked_elements: {
        Row: {
          clicks_count: number | null
          created_at: string
          h: number | null
          id: number
          l: number | null
          s: string | null
          snapshot_id: string | null
          t: number | null
          w: number | null
        }
        Insert: {
          clicks_count?: number | null
          created_at?: string
          h?: number | null
          id?: number
          l?: number | null
          s?: string | null
          snapshot_id?: string | null
          t?: number | null
          w?: number | null
        }
        Update: {
          clicks_count?: number | null
          created_at?: string
          h?: number | null
          id?: number
          l?: number | null
          s?: string | null
          snapshot_id?: string | null
          t?: number | null
          w?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clicked_elements_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      clicks: {
        Row: {
          device: string
          erx: number
          ery: number
          first_click_rank: number | null
          h: number
          id: string
          inserted_at: string
          l: number
          s: string
          t: number
          timestamp: string
          tracking_id: string
          url: string
          visible: boolean
          w: number
        }
        Insert: {
          device: string
          erx: number
          ery: number
          first_click_rank?: number | null
          h: number
          id?: string
          inserted_at?: string
          l: number
          s: string
          t: number
          timestamp: string
          tracking_id: string
          url: string
          visible: boolean
          w: number
        }
        Update: {
          device?: string
          erx?: number
          ery?: number
          first_click_rank?: number | null
          h?: number
          id?: string
          inserted_at?: string
          l?: number
          s?: string
          t?: number
          timestamp?: string
          tracking_id?: string
          url?: string
          visible?: boolean
          w?: number
        }
        Relationships: [
          {
            foreignKeyName: "clicks_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["tracking_id"]
          },
        ]
      }
      page_config: {
        Row: {
          created_at: string
          id: string
          ignored_el: string[] | null
          is_active: boolean
          path: string
          privacy_el: string[] | null
          project_config_id: string
          update_snap: boolean
          url_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ignored_el?: string[] | null
          is_active?: boolean
          path: string
          privacy_el?: string[] | null
          project_config_id: string
          update_snap?: boolean
          url_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ignored_el?: string[] | null
          is_active?: boolean
          path?: string
          privacy_el?: string[] | null
          project_config_id?: string
          update_snap?: boolean
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_config_project_config_id_fkey"
            columns: ["project_config_id"]
            isOneToOne: false
            referencedRelation: "project_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_config_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: true
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      project_config: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          project_id: string
          tracking_id: string
          usageExceeded: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          is_active: boolean
          project_id: string
          tracking_id: string
          usageExceeded?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          project_id?: string
          tracking_id?: string
          usageExceeded?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "config_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["tracking_id"]
          },
          {
            foreignKeyName: "project_config_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          base_url: string
          created_at: string
          id: string
          label: string | null
          tracking_id: string
          type: string | null
          user_id: string
        }
        Insert: {
          base_url: string
          created_at?: string
          id?: string
          label?: string | null
          tracking_id: string
          type?: string | null
          user_id?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          id?: string
          label?: string | null
          tracking_id?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      snapshots: {
        Row: {
          created_at: string
          device: string
          dom_data: string | null
          height: number | null
          id: string
          is_outdated: boolean
          label: string | null
          last_processed_at: string
          layout_hash: string | null
          screenshot_url: string | null
          should_update: boolean
          total_clicks: number
          url_id: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          device: string
          dom_data?: string | null
          height?: number | null
          id?: string
          is_outdated?: boolean
          label?: string | null
          last_processed_at?: string
          layout_hash?: string | null
          screenshot_url?: string | null
          should_update?: boolean
          total_clicks?: number
          url_id: string
          user_id?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          device?: string
          dom_data?: string | null
          height?: number | null
          id?: string
          is_outdated?: boolean
          label?: string | null
          last_processed_at?: string
          layout_hash?: string | null
          screenshot_url?: string | null
          should_update?: boolean
          total_clicks?: number
          url_id?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "snapshots_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      urls: {
        Row: {
          clicks: number
          created_at: string
          id: string
          label: string | null
          path: string
          project_id: string
          tracking_id: string
          user_id: string
          views: number
        }
        Insert: {
          clicks?: number
          created_at?: string
          id?: string
          label?: string | null
          path: string
          project_id: string
          tracking_id: string
          user_id?: string
          views?: number
        }
        Update: {
          clicks?: number
          created_at?: string
          id?: string
          label?: string | null
          path?: string
          project_id?: string
          tracking_id?: string
          user_id?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "urls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urls_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["tracking_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_aggregated_clicks: {
        Args: { clicks: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
