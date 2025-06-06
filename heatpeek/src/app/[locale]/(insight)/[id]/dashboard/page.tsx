import { getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metrics } from "./Metrics";
import { TopPage } from "./TopPage";
import { Summary } from "./Summary";

export default async function PageSetupSite() {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Metrics />
      <TopPage />
      <Summary />
    </div>
  );
}
