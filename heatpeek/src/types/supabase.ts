export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      page_config: {
        Row: {
          created_at: string
          exclude_el: string[] | null
          id: string
          path: string
          privacy_el: string[] | null
          project_id: string
          update_snap_desktop: boolean
          update_snap_mobile: boolean
          update_snap_tablet: boolean
          url_id: string
        }
        Insert: {
          created_at?: string
          exclude_el?: string[] | null
          id?: string
          path: string
          privacy_el?: string[] | null
          project_id: string
          update_snap_desktop?: boolean
          update_snap_mobile?: boolean
          update_snap_tablet?: boolean
          url_id: string
        }
        Update: {
          created_at?: string
          exclude_el?: string[] | null
          id?: string
          path?: string
          privacy_el?: string[] | null
          project_id?: string
          update_snap_desktop?: boolean
          update_snap_mobile?: boolean
          update_snap_tablet?: boolean
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_config_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      plans: {
        Row: {
          created_at: string
          data_retention_days: number | null
          id: string
          max_total_tracked_pages: number | null
          max_websites: number | null
          pageviews_limit: number | null
        }
        Insert: {
          created_at?: string
          data_retention_days?: number | null
          id: string
          max_total_tracked_pages?: number | null
          max_websites?: number | null
          pageviews_limit?: number | null
        }
        Update: {
          created_at?: string
          data_retention_days?: number | null
          id?: string
          max_total_tracked_pages?: number | null
          max_websites?: number | null
          pageviews_limit?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          base_url: string
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          tracking_id: string
          type: string | null
          usage_exceeded: boolean
          user_id: string
        }
        Insert: {
          base_url: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          tracking_id: string
          type?: string | null
          usage_exceeded?: boolean
          user_id?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          tracking_id?: string
          type?: string | null
          usage_exceeded?: boolean
          user_id?: string
        }
        Relationships: []
      }
      snapshots: {
        Row: {
          created_at: string
          device: Database["public"]["Enums"]["device"]
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
          device: Database["public"]["Enums"]["device"]
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
          device?: Database["public"]["Enums"]["device"]
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
          created_at: string
          id: string
          label: string | null
          path: string
          project_id: string
          tracking_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          path: string
          project_id: string
          tracking_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          path?: string
          project_id?: string
          tracking_id?: string
          user_id?: string
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
      user_profiles: {
        Row: {
          created_at: string | null
          current_plan: string | null
          email: string
          full_name: string | null
          id: string
          is_locked: boolean | null
          stripe_customer_id: string | null
          subscription_current_period_end: string | null
          subscription_status: string | null
          subscription_trial_end: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_plan?: string | null
          email: string
          full_name?: string | null
          id: string
          is_locked?: boolean | null
          stripe_customer_id?: string | null
          subscription_current_period_end?: string | null
          subscription_status?: string | null
          subscription_trial_end?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_plan?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_locked?: boolean | null
          stripe_customer_id?: string | null
          subscription_current_period_end?: string | null
          subscription_status?: string | null
          subscription_trial_end?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_current_plan_fkey"
            columns: ["current_plan"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_url_with_config: {
        Args: {
          _exclude_elements?: string[]
          _label: string
          _path: string
          _project_id: string
          _sensitive_element?: string[]
        }
        Returns: string
      }
      update_url_and_config: {
        Args: {
          _exclude_elements: string[]
          _label: string
          _sensitive_element: string[]
          _url_id: string
        }
        Returns: undefined
      }
      upsert_aggregated_clicks: {
        Args: { clicks: Json }
        Returns: undefined
      }
    }
    Enums: {
      device: "desktop" | "tablet" | "mobile"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      device: ["desktop", "tablet", "mobile"],
    },
  },
} as const
