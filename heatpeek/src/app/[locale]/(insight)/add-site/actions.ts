"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { WebsiteType } from "./types";
import { getUser } from "@/lib/supabase/queries";
import { nanoid } from "nanoid";

const siteSchema = z.object({
  siteLabel: z
    .string()
    .max(18, "Site label must be less than 18 characters")
    .optional(),
  websiteType: z
    .enum([
      WebsiteType.SAAS,
      WebsiteType.ECOMMERCE,
      WebsiteType.BLOG,
      WebsiteType.PORTFOLIO,
      WebsiteType.CORPORATE,
      WebsiteType.OTHER,
    ])
    .nullable()
    .optional(),
  baseUrl: z
    .string()
    .min(1, "Base URL is required")
    .url("Please enter a valid URL"),
});

export async function addSiteAction(formData: FormData) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const data = {
    siteLabel: formData.get("siteLabel") as string,
    websiteType: formData.get("websiteType") as WebsiteType | null,
    baseUrl: formData.get("baseUrl") as string,
  };

  if (!data.websiteType) {
    data.websiteType = null;
  }

  const validationResult = siteSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error(validationResult.error.errors[0].message);
  }

  let projectId = null;

  const label = data.siteLabel || new URL(data.baseUrl).hostname;

  try {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert({
        label,
        base_url: data.baseUrl,
        tracking_id: nanoid(8),
        type: data.websiteType,
      })
      .select("id")
      .single();

    if (projectError) {
      console.error("Failed to create project:", projectError);
      throw new Error("Failed to create site");
    }

    if (!projectData) {
      throw new Error("Failed to get site id");
    }

    projectId = projectData.id;
  } catch (error) {
    console.error("Unexpected error in addSiteAction:", error);
    throw new Error("An unexpected error occurred");
  }

  revalidatePath(`/${projectId}/get-started`, "layout");
  redirect(`/${projectId}/get-started`);
}
