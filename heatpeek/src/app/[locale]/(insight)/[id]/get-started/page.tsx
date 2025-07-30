import { getTrackingIdAndBaseUrl, getUser } from "@/lib/supabase/queries";
import { SetupSite } from "./setup-site";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PageGetStarted({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id } = params;

  const result = await getTrackingIdAndBaseUrl(supabase, id);
  if (!result) {
    return <div>Error</div>;
  }

  return (
    <SetupSite trackingId={result.tracking_id} baseUrl={result.base_url} />
  );
}
