"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  deleteUrl,
  getUser,
  getUserPlanLimits,
  getTotalTrackedPages,
  updateUrl,
} from "@/lib/supabase/queries";
import { getI18n } from "@locales/server";
import { urlAddSchema, urlUpdateSchema } from "./types";
import { z } from "zod";
import { purgeConfig, purgeSnapshot } from "@/lib/cloudflare/api";

export async function addNewUrlAndPageConfigAction(
  data: z.infer<ReturnType<typeof urlAddSchema>>,
  trackingId: string
) {
  try {
    const t = await getI18n();
    const supabase = await createClient();

    const result = urlAddSchema(t).safeParse(data);

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

export async function updateUrlAction(
  urlId: string,
  data: z.infer<ReturnType<typeof urlUpdateSchema>>
) {
  const t = await getI18n();
  const supabase = await createClient();

  const result = urlUpdateSchema(t).safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  await updateUrl(supabase, urlId, {
    label: result.data.label || null,
  });

  revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
}
