"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addPageConfig,
  addUrl,
  deleteUrl,
  getTrackingId,
  getProjectConfigId,
  updateUrl,
  updatePageConfig,
} from "@/lib/supabase/queries";
import { getI18n } from "@locales/server";
import { urlAddSchema, urlUpdateSchema } from "./types";
import { z } from "zod";

export async function addNewUrlAndPageConfigAction(
  data: z.infer<ReturnType<typeof urlAddSchema>>
) {
  const t = await getI18n();
  const supabase = await createClient();

  const result = urlAddSchema(t).safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const trackingId = await getTrackingId(supabase, result.data.projectId);
  if (!trackingId) throw new Error("Tracking ID not found");

  const projectConfigId = await getProjectConfigId(
    supabase,
    result.data.projectId
  );
  if (!projectConfigId) throw new Error("Project config ID not found");

  const path = new URL(result.data.url).pathname;

  const urlId = await addUrl(supabase, {
    path,
    label: result.data.label || null,
    project_id: result.data.projectId,
    tracking_id: trackingId,
  });

  try {
    await addPageConfig(supabase, {
      path,
      is_active: result.data.is_active,
      project_config_id: projectConfigId,
      url_id: urlId,
    });
  } catch (err) {
    // Rollback the previous insert if this fails
    await deleteUrl(supabase, urlId);
    console.error("Failed to add page config. Rolled back URL creation.", err);
    throw new Error("Failed to add page config.");
  }

  revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
}

export async function deleteUrlAction(urlId: string) {
  const supabase = await createClient();

  await deleteUrl(supabase, urlId);

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

  if (result.data.is_active) {
    await updatePageConfig(supabase, urlId, {
      is_active: result.data.is_active,
    });
  }

  revalidatePath(`/[locale]/(insight)/[id]/manage-urls`, "page");
}
