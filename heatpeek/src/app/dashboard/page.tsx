import Heatmap from "./Heatmap";
import {
  getClicks,
  getSnapshot,
  getSnapshotsUrls,
  getTrackingId,
  getUser,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { OptionsBar } from "./OptionsBar";
import { Sidebar } from "./Sidebar";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { id?: string; url?: string; device?: string };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const snapshotsUrls = await getSnapshotsUrls(supabase, user?.id);
  if (!snapshotsUrls || snapshotsUrls.length === 0) {
    redirect(`/add-page`);
  }
  if (snapshotsUrls && snapshotsUrls.length > 0) {
    const currentId = searchParams.id;

    if (!currentId) {
      const firstSnapshot = snapshotsUrls[0];
      redirect(`/dashboard?id=${firstSnapshot.id}`);
    }
  }

  const id = searchParams.id as string;
  const trackingId = await getTrackingId(supabase, user.id);
  if (!trackingId) return;
  const currentSnapshot = snapshotsUrls.find((snapshot) => snapshot.id === id);
  if (!currentSnapshot) return;
  const url = currentSnapshot.url;
  const device = currentSnapshot.device;
  const created_at = currentSnapshot.created_at;

  const clicks = await getClicks(supabase, trackingId, url, device, created_at);
  const snapshot = await getSnapshot(supabase, id);

  if (!snapshot) {
    return <div>No snapshot found</div>;
  }
  // const deserializedData = snapshot
  //   ? deserializePageData(snapshot.domData)
  //   : null;

  const visibleElement = JSON.parse(snapshot?.domData);

  return (
    <div className="flex">
      <Sidebar snapshotsUrls={snapshotsUrls || []} />
      <div className="flex-1 p-4">
        <Card className="border-primary/20">
          <div className="container mx-auto p-8 relative">
            <div className="w-full">
              <div className="min-w-full">
                <Heatmap
                  clicks={clicks || []}
                  pageData={snapshot}
                  visibleElement={visibleElement}
                />
              </div>
            </div>
            <div className="w-full">
              <OptionsBar />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
