"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteProject } from "@/lib/supabase/queries";

export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient();
  const success = await deleteProject(supabase, projectId);
  if (!success) return;
  revalidatePath("/sites", "layout");
}
