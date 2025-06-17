import { getUser, getUrlsAndConfig } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";
import UrlsTable from "./UrlsTable";

export default async function ManagePages({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id } = await params;

  const urls = await getUrlsAndConfig(supabase, id);

  return (
    <div className="flex-1 container py-6">
      <Header projectId={id} />
      {urls && <UrlsTable urls={urls} />}
    </div>
  );
}
