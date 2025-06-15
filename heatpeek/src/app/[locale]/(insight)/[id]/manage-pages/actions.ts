"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import {
  addPageConfig,
  addUrl,
  deleteUrl,
  getTrackingId,
  getProjectConfigId,
} from "@/lib/supabase/queries";

const urlSchema = z.object({
  url: z.string().min(1, "URL is required").url("Please enter a valid URL"),
  label: z.string().max(20, "Label must be less than 20 characters").optional(),
  is_active: z.boolean(),
  projectId: z.string(),
});

export async function addNewUrlAndPageConfigAction(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    url: formData.get("url"),
    label: formData.get("label"),
    is_active: formData.get("is_active") === "on",
    projectId: formData.get("projectId"),
  };

  const validatedData = urlSchema.parse(rawData);

  const trackingId = await getTrackingId(supabase, validatedData.projectId);
  if (!trackingId) throw new Error("Tracking ID not found");

  const projectConfigId = await getProjectConfigId(
    supabase,
    validatedData.projectId
  );
  if (!projectConfigId) throw new Error("Project config ID not found");

  const path = new URL(validatedData.url).pathname;

  const urlId = await addUrl(supabase, {
    path,
    label: validatedData.label || null,
    project_id: validatedData.projectId,
    tracking_id: trackingId,
  });

  try {
    await addPageConfig(supabase, {
      path,
      is_active: validatedData.is_active,
      project_config_id: projectConfigId,
      url_id: urlId,
    });
  } catch (err) {
    // Rollback the previous insert if this fails
    await deleteUrl(supabase, urlId);
    console.error("Failed to add page config. Rolled back URL creation.", err);
    throw new Error("Failed to add page config.");
  }

  revalidatePath(`/[locale]/(insight)/[id]/manage-pages`, "page");
}

export async function deleteUrlAction(urlId: string) {
  const supabase = await createClient();

  const result = await deleteUrl(supabase, urlId);

  if (!result) {
    throw new Error("Failed to delete url.");
  }

  revalidatePath(`/[locale]/(insight)/[id]/manage-pages`, "page");
}
