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
  trackingId: string;
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
  async (
    supabase: SupabaseClient,
    clickInfos: ClickInfos
  ): Promise<ClickInfos | null> => {
    const { data, error } = await supabase.from("clicks").insert([clickInfos]);
    console.log("data", data);
    if (error) {
      console.error("Error inserting click:", error);
      return null;
    }

    return data;
  }
);

export type Click = Omit<
  ClickInfos,
  "trackingId" | "url" | "timestamp" | "user_agent" | "device" | "visible"
>;

//Refresh data every 6 hours to limit request ?
export const getClicks = cache(
  async (
    supabase: SupabaseClient,
    trackingId: string,
    url: string,
    device: string,
    timestamp: string
  ): Promise<Click[] | null> => {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select("erx, ery, s, l, t, w, h")
      .eq("trackingId", trackingId)
      .eq("url", url)
      .eq("device", device)
      .gte("timestamp", timestamp);

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
  async (
    supabase: SupabaseClient,
    snapshotInfos: SnapshotInfos
  ): Promise<SnapshotInfos | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .insert([snapshotInfos]);

    if (error) {
      console.error("Error inserting snapshot:", error);
      return null;
    }

    return data;
  }
);

export const getSnapshot = cache(
  async (
    supabase: SupabaseClient,
    id: string
  ): Promise<SnapshotInfos | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select(
        "url, label, device, domData,layoutHash, screenshotUrl, width, height"
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching snapshot:", error);
      return null;
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
  async (
    supabase: SupabaseClient,
    uploadInfos: UploadScreenshotInfos
  ): Promise<string | null> => {
    const fileName = `${uploadInfos.userId}/screenshot-${
      uploadInfos.layoutHash
    }-${Date.now()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(fileName, uploadInfos.buffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading screenshot:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
);

export type SnapshotUrl = Omit<
  SnapshotInfos,
  "domData" | "layoutHash" | "screenshotUrl" | "width" | "height"
> & {
  created_at: string;
  id: string;
};

export const getSnapshotsUrls = cache(
  async (
    supabase: SupabaseClient,
    userId: string
  ): Promise<SnapshotUrl[] | null> => {
    const { data, error } = await supabase
      .from("snapshots")
      .select("id, url, label, device, created_at")
      .eq("userId", userId);

    if (error) {
      console.error("Error fetching snapshot:", error);
      return null;
    }

    return data;
  }
);

export const addTrackingId = cache(
  async (supabase: SupabaseClient, userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("tracking_ids")
      .insert([{ userId: userId }])
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting tracking ID:", error);
      return null;
    }

    return data.id;
  }
);
export const getTrackingId = cache(
  async (supabase: SupabaseClient, userId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("tracking_ids")
      .select("id")
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Error getting tracking ID:", error);
      return null;
    }

    return data.id;
  }
);
