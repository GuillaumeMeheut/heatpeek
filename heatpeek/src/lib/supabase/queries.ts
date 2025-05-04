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
  element: string;
  class?: string;
  id_attr?: string;
  user_agent?: string;
};

export const addClick = cache(
  async (supabase: SupabaseClient, clickInfos: ClickInfos) => {
    const { data, error } = await supabase
      .from("clicks")
      .insert([clickInfos])
      .select();

    if (error) {
      console.error("Error inserting click:", error);
      throw error;
    }

    return data;
  }
);

type Clicks = {
  x: number;
  y: number;
  screenWidth: number;
  screenHeight: number;
};

//Refresh data every 6 hours to limit request ?
export const getClicks = cache(
  async (
    supabase: SupabaseClient,
    projectId: string
  ): Promise<Clicks[] | null> => {
    const { data: clicks, error } = await supabase
      .from("click_infos")
      .select("x, y, screenWidth, screenHeight")
      .eq("projectId", projectId);

    if (error) {
      return null;
    }

    return clicks;
  }
);
