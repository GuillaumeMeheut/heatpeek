import { getUser, getUrlsAndConfig } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";
import UrlsTable from "./UrlsTable";
import { getI18n } from "@locales/server";
import AddUrl from "./AddUrl";

export default async function ManagePages({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id } = await params;
  const t = await getI18n();
  const urls = await getUrlsAndConfig(supabase, id);

  return (
    <div className="flex-1 container py-6">
      <Header projectId={id} />
      {urls && urls.length > 0 ? (
        <UrlsTable urls={urls} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 mt-[15%]">
          <p className="text-muted-foreground">
            {t("urlManagement.emptyState")}
          </p>
          <AddUrl projectId={id} />
        </div>
      )}
    </div>
  );
}
