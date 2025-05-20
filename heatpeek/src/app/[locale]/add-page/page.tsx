import { getTrackingId, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { ClientAddPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function AddPage() {
  const supabase = createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const trackingId = await getTrackingId(supabase, user.id);

  return <ClientAddPage trackingId={trackingId} />;
}
