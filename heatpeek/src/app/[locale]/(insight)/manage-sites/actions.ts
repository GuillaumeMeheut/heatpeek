"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addProject,
  deleteProject,
  getTotalProjects,
  getUser,
  getUserPlanLimits,
  updateProject,
} from "@/lib/supabase/queries";
import { projectAddSchema, projectUpdateSchema } from "./types";
import { redirect } from "next/navigation";
import { getI18n } from "@locales/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { purgeConfigMany } from "@/lib/cloudflare/api";

export async function addProjectAction(
  data: z.infer<ReturnType<typeof projectAddSchema>>
) {
  const t = await getI18n();
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) {
    throw new Error("User not found.");
  }

  const result = projectAddSchema(t).safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  const userPlanLimits = await getUserPlanLimits(supabase, user.id);

  if (!userPlanLimits) {
    throw new Error("User plan limits not found.");
  }

  const currentTrackedWebsites = await getTotalProjects(supabase, user.id);

  if (currentTrackedWebsites === null) {
    throw new Error("Current tracked websites not found.");
  }
  console.log(currentTrackedWebsites);

  if (currentTrackedWebsites >= userPlanLimits.max_websites) {
    throw new Error(
      "You have reached the maximum number of websites for your plan."
    );
  }

  const label = data.label || new URL(data.baseUrl).hostname;
  const tracking_id = nanoid(8);

  const projectId = await addProject(supabase, {
    label,
    base_url: data.baseUrl,
    tracking_id,
    type: data.type,
  });

  revalidatePath(`/${projectId}/manage-urls`, "layout");
  redirect(`/${projectId}/manage-urls`);
}

export async function deleteProjectAction(
  projectId: string,
  trackingId: string
) {
  const supabase = await createClient();
  await deleteProject(supabase, projectId);

  await purgeConfigMany(trackingId);

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
