"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteUrl, updateUrl, updatePageConfig } from "@/lib/supabase/queries";
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

  const { error } = await supabase.rpc("add_url_with_config_and_snapshots", {
    _path: new URL(result.data.url).pathname,
    _label: result.data.label || null,
    _project_id: result.data.projectId,
    _is_active: result.data.is_active,
  });

  if (error) {
    console.error("error", error);
    if (error.code === "23505") {
      throw new Error("This URL already exists in the project.");
    }

    if (error.code === "P0001") {
      throw new Error("Missing project configuration.");
    }

    throw new Error("An unexpected error occurred.");
  }

  if (!data) {
    throw new Error("Failed to create URL.");
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
