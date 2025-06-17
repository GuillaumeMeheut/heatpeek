"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addProject,
  addProjectConfig,
  deleteProject,
  getUser,
  updateProject,
} from "@/lib/supabase/queries";
import { projectAddSchema, projectUpdateSchema } from "./types";
import { redirect } from "next/navigation";
import { getI18n } from "@locales/server";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function addProjectAction(
  data: z.infer<ReturnType<typeof projectAddSchema>>
) {
  const t = await getI18n();
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const result = projectAddSchema(t).safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const label = data.label || new URL(data.baseUrl).hostname;
  const tracking_id = nanoid(8);

  const projectId = await addProject(supabase, {
    label,
    base_url: data.baseUrl,
    tracking_id,
    type: data.type,
  });

  try {
    await addProjectConfig(supabase, { tracking_id, project_id: projectId });
  } catch (err) {
    // Rollback the previous insert if this fails
    await deleteProject(supabase, projectId);
    console.error(
      "Failed to add project config. Rolled back project creation.",
      err
    );
    throw new Error("Failed to add project config.");
  }

  revalidatePath(`/${projectId}/manage-urls`, "layout");
  redirect(`/${projectId}/manage-urls`);
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient();
  await deleteProject(supabase, projectId);
  revalidatePath("/manage-sites", "layout");
}

export async function updateProjectAction(
  projectId: string,
  data: z.infer<ReturnType<typeof projectUpdateSchema>>
) {
  const t = await getI18n();
  const supabase = await createClient();

  const result = projectUpdateSchema(t).safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  await updateProject(supabase, projectId, {
    label: result.data.label || null,
    type: result.data.type || undefined,
    base_url: result.data.baseUrl,
  });

  revalidatePath(`/[locale]/(insight)/manage-sites`, "page");
}
