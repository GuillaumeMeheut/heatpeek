"use server";

import { purgeConfig } from "@/lib/cloudflare/api";
import { addSnapshot, updatePageConfig } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { getSuccessRedirect } from "@/lib/utils";
import { Device, SnapshotsRow, UrlsRow } from "@/types/database";
import { redirect } from "next/navigation";

type Snapshot = Pick<SnapshotsRow, "label"> & {
  urls: Pick<UrlsRow, "path" | "tracking_id">;
};

export async function createNewVersion(
  urlId: string,
  device: Device,
  referer: string
) {
  if (!urlId || !device) {
    throw new Error(
      "Missing required parameters: urlId and device are required"
    );
  }

  const supabase = await createClient();

  const { data, error: snapshotError } = await supabase
    .from("snapshots")
    .update({ is_outdated: true })
    .eq("url_id", urlId)
    .eq("device", device)
    .eq("is_outdated", false)
    .select("label, urls!inner(path, tracking_id)")
    .single();

  if (snapshotError) {
    console.error("Snapshot update error:", snapshotError);
    throw new Error(
      `Failed to update current snapshot: ${snapshotError.message}`
    );
  }

  const currentSnapshot = data as unknown as Snapshot;

  if (!currentSnapshot) {
    throw new Error("No active snapshot found to update");
  }

  const deviceFieldMap = {
    desktop: "update_snap_desktop",
    tablet: "update_snap_tablet",
    mobile: "update_snap_mobile",
  } as const;

  const updateField = deviceFieldMap[device];
  if (!updateField) {
    throw new Error("Invalid device type");
  }

  await updatePageConfig(supabase, urlId, {
    [updateField]: true,
  });

  await addSnapshot(supabase, {
    url_id: urlId,
    device,
    label: currentSnapshot.label,
  });

  await purgeConfig(
    currentSnapshot.urls.tracking_id,
    currentSnapshot.urls.path
  );

  redirect(getSuccessRedirect(referer, "Success!", "New version created."));
}
