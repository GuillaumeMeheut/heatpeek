"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  deleteUrl,
  getUser,
  getUserPlanLimits,
  getTotalTrackedPages,
} from "@/lib/supabase/queries";
import { getI18n } from "@locales/server";
import { urlAddSchema, urlUpdateSchema } from "./types";
import { purgeConfig, purgeSnapshot } from "@/lib/cloudflare/api";

export async function addNewUrlAndPageConfigAction(
  data: FormData,
  trackingId: string
) {
  try {
    const t = await getI18n();
    const supabase = await createClient();

    const rawData = {
      url: data.get("url"),
      label: data.get("label"),
      projectId: data.get("projectId"),
      sensitiveElement: data.get("sensitiveElements"),
      excludeElements: data.get("excludeElements"),
    };

    const result = urlAddSchema(t).safeParse(rawData);

    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }
    const { user } = await getUser(supabase);

    if (!user) {
      throw new Error("User not found.");
    }

    const userPlanLimits = await getUserPlanLimits(supabase, user.id);

    if (!userPlanLimits) {
      throw new Error("User plan limits not found.");
    }

    const currentTrackedPages = await getTotalTrackedPages(supabase, user.id);

    if (currentTrackedPages === null) {
      throw new Error("Current tracked pages not found.");
    }

    if (currentTrackedPages >= userPlanLimits.max_total_tracked_pages) {
      throw new Error(
        "You have reached the maximum number of tracked pages for your plan."
      );
    }

    const path = new URL(result.data.url).pathname;

    const { error } = await supabase.rpc("create_url_with_config", {
      _path: path,
      _label: result.data.label || null,
      _project_id: result.data.projectId,
      _sensitive_element: result.data.sensitiveElement || null,
      _exclude_elements: result.data.excludeElements || null,
    });

    if (error) {
      console.error("error", error);
      if (error.code === "23505") {
        throw new Error("This URL already exists for this website.");
      }

      if (error.code === "P0001") {
        throw new Error("Missing project configuration.");
      }

      throw new Error("An unexpected error occurred.");
    }

    await purgeConfig(trackingId, path);

    await purgeSnapshot(trackingId, path, "all");

    revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
  } catch (error) {
    console.error("Add new url and page config action error", error);
    throw new Error("Failed to create URL.");
  }
}

export async function deleteUrlAction(
  urlId: string,
  trackingId: string,
  path: string
) {
  const supabase = await createClient();

  await deleteUrl(supabase, urlId);

  await purgeConfig(trackingId, path);

  await purgeSnapshot(trackingId, path, "all");

  revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
}

export async function updateUrlAction(urlId: string, data: FormData) {
  const t = await getI18n();
  const supabase = await createClient();

  const rawData = {
    label: data.get("label"),
    sensitiveElement: data.get("sensitiveElement"),
    excludeElements: data.get("excludeElements"),
  };

  const result = urlUpdateSchema(t).safeParse(rawData);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const { error } = await supabase.rpc("update_url_and_config", {
    _url_id: urlId,
    _label: result.data.label,
    _sensitive_element: result.data.sensitiveElement || null,
    _exclude_elements: result.data.excludeElements || null,
  });

  if (error) {
    console.error("Error updating url and config:", error);
    throw new Error("Failed to update url and config");
  }

  revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
}
