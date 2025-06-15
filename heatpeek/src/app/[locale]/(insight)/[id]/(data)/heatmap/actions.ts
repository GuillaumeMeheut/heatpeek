"use server";

import { addSnapshot } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { getSuccessRedirect } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createNewVersion(
  urlId: string,
  device: string,
  referer: string
) {
  if (!urlId || !device) {
    throw new Error(
      "Missing required parameters: urlId and device are required"
    );
  }

  const supabase = await createClient();

  const { data: currentSnapshot, error: snapshotError } = await supabase
    .from("snapshots")
    .update({ is_outdated: true })
    .eq("url_id", urlId)
    .eq("device", device)
    .eq("is_outdated", false)
    .select("label")
    .single();

  if (snapshotError) {
    console.error("Snapshot update error:", snapshotError);
    throw new Error(
      `Failed to update current snapshot: ${snapshotError.message}`
    );
  }

  if (!currentSnapshot) {
    throw new Error("No active snapshot found to update");
  }

  const { error: configError } = await supabase
    .from("page_config")
    .update({ update_snap: true })
    .eq("url_id", urlId);

  if (configError) {
    console.error("Config update error:", configError);
    throw new Error(`Failed to update page config: ${configError.message}`);
  }

  await addSnapshot(supabase, {
    url_id: urlId,
    device,
    label: currentSnapshot.label,
  });

  redirect(getSuccessRedirect(referer, "Success!", "New version created."));
}
