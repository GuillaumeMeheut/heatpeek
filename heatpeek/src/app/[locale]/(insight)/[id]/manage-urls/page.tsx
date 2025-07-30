import { getUrlsAndConfig, getTrackingId } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";
import UrlsTable from "./UrlsTable";
import { getI18n } from "@locales/server";
import AddUrl from "./AddUrl";

export default async function ManagePages({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { id } = params;
  const t = await getI18n();

  const urls = await getUrlsAndConfig(supabase, id);

  const trackingId = await getTrackingId(supabase, id);

  if (!trackingId) return;

  return (
    <div className="flex-1 container py-6">
      <Header projectId={id} trackingId={trackingId} />
      {urls && urls.length > 0 ? (
        <UrlsTable urls={urls} projectId={id} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 mt-[15%]">
          <p className="text-muted-foreground">
            {t("urlManagement.emptyState")}
          </p>
          <AddUrl projectId={id} trackingId={trackingId} />
        </div>
      )}
    </div>
  );
}
