import { getTrackingId, getUser } from "@/lib/supabase/queries";
import { SetupSite } from "./setup-site";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PageGetStarted({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id } = await params;

  const trackingId = await getTrackingId(supabase, id);

  return <SetupSite trackingId={trackingId} />;
}
