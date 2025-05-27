import Heatmap from "./Heatmap";
import {
  getSnapshot,
  getSnapshotsInfos,
  getTrackingId,
  getUser,
  getAggregatedClicks,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { OptionsBar } from "./OptionsBar";
import { Sidebar } from "./Sidebar";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { id?: string; url?: string; device?: string };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const snapshotsInfos = await getSnapshotsInfos(supabase, user.id);
  if (!snapshotsInfos || snapshotsInfos.length === 0) {
    redirect(`/add-page`);
  }
  if (snapshotsInfos && snapshotsInfos.length > 0) {
    const currentId = searchParams.id;

    if (!currentId) {
      const firstSnapshot = snapshotsInfos[0];
      redirect(`/dashboard?id=${firstSnapshot.id}`);
    }
  }

  const id = searchParams.id as string;
  const trackingId = await getTrackingId(supabase, user.id);
  if (!trackingId) return;
  const currentSnapshot = snapshotsInfos.find((snapshot) => snapshot.id === id);
  if (!currentSnapshot) return;

  const snapshot = await getSnapshot(supabase, id);
  const aggregatedClicks = await getAggregatedClicks(supabase, id);

  if (!snapshot) {
    return <div>No snapshot found</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <div className="flex">
        <Sidebar snapshotsInfos={snapshotsInfos || []} />
        <div className="flex-1 p-4">
          <Card className="border-primary/20">
            <div className="container mx-auto p-4 relative">
              <div className="w-full">
                <div className="relative min-w-full">
                  <OptionsBar />
                  <Heatmap
                    aggregatedClicks={aggregatedClicks || []}
                    pageData={snapshot}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
