import { cache } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

export const getUserProfile = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data: userProfile, error } = await supabase
      .from("user_profiles")
      .select()
      .eq("id", userId)
      .single();

    if (error) return null;

    return userProfile;
  }
);

export type ClickInfos = {
  project_id: string;
  url: string;
  relative_x: number;
  relative_y: number;
  screen_width: number;
  screen_height: number;
  timestamp: string;
  selector: string;
  user_agent?: string;
  visible?: boolean;
  element_relative_x?: number;
  element_relative_y?: number;
  bbox_left?: number;
  bbox_top?: number;
  bbox_width?: number;
  bbox_height?: number;
};

export const addClick = cache(
  async (supabase: SupabaseClient, clickInfos: ClickInfos) => {
    const { data, error } = await supabase.from("clicks").insert([clickInfos]);

    if (error) {
      console.error("Error inserting click:", error);
      throw error;
    }

    return data;
  }
);

type Clicks = {
  relative_x: number;
  relative_y: number;
  screen_width: number;
  screen_height: number;
  url: string;
  selector: string;
  element_relative_x?: number;
  element_relative_y?: number;
  bbox_left?: number;
  bbox_top?: number;
  bbox_width?: number;
  bbox_height?: number;
};

//Refresh data every 6 hours to limit request ?
export const getClicks = cache(
  async (
    supabase: SupabaseClient,
    projectId: string,
    url: string
  ): Promise<Clicks[] | null> => {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select(
        "relative_x, relative_y, element_relative_x, element_relative_y, screen_width, screen_height, url, bbox_left, bbox_top, bbox_width, bbox_height, selector"
      )
      .eq("project_id", projectId)
      .eq("url", url);

    if (error) {
      console.error("Error fetching clicks:", error);
      return null;
    }

    return clicks;
  }
);
