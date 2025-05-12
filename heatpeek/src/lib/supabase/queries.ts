import { cache } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

export type ClickInfos = {
  project_id: string;
  url: string;
  timestamp: string;
  user_agent?: string;
  device: string;
  visible?: boolean;
  erx?: number;
  ery?: number;
  s?: string;
  l?: number;
  t?: number;
  w?: number;
  h?: number;
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

export type Click = Omit<
  ClickInfos,
  "project_id" | "url" | "timestamp" | "user_agent" | "device" | "visible"
>;

//Refresh data every 6 hours to limit request ?
export const getClicks = cache(
  async (
    supabase: SupabaseClient,
    projectId: string,
    url: string,
    device: string
  ): Promise<Click[] | null> => {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select("erx, ery, s, l, t, w, h")
      .eq("project_id", projectId)
      .eq("url", url)
      .eq("device", device);

    if (error) {
      console.error("Error fetching clicks:", error);
      return null;
    }

    return clicks;
  }
);

export type SnapshotInfos = {
  url: string;
  label: string;
  device: string;
  domData: string;
  layoutHash: string;
  screenshotUrl: string;
  width: number;
  height: number;
};

export const addSnapshot = cache(
  async (supabase: SupabaseClient, snapshotInfos: SnapshotInfos) => {
    const { data, error } = await supabase
      .from("snapshots")
      .insert([snapshotInfos]);

    if (error) {
      console.error("Error inserting snapshot:", error);
    }

    return data;
  }
);

export const getSnapshot = cache(
  async (
    supabase: SupabaseClient,
    url: string,
    device: string,
    userId: string
  ): Promise<SnapshotInfos | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select(
        "url, label, device, domData,layoutHash, screenshotUrl, width, height"
      )
      .eq("url", url)
      .eq("device", device)
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Error fetching snapshot:", error);
    }

    return data;
  }
);

export type UploadScreenshotInfos = {
  userId: string;
  layoutHash: string;
  buffer: Uint8Array;
};

export const uploadScreenshot = cache(
  async (supabase: SupabaseClient, uploadInfos: UploadScreenshotInfos) => {
    const fileName = `${uploadInfos.userId}/screenshot-${
      uploadInfos.layoutHash
    }-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, uploadInfos.buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading screenshot:", uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl;
  }
);

export type SnapshotUrl = Omit<
  SnapshotInfos,
  "domData" | "layoutHash" | "screenshotUrl" | "width" | "height"
>;

export const getSnapshotsUrls = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<SnapshotUrl[] | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("url, label, device")
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching snapshot:", error);
    }

    return data;
  }
);
