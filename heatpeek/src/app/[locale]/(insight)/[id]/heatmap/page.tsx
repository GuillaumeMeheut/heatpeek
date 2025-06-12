import Heatmap from "./Heatmap";
import {
  getSnapshot,
  getUser,
  getAggregatedClicks,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { OptionsBar } from "./OptionsBar";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function HeatmapPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { url?: string; device?: string };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");
  const { id: projectId } = await params;
  const url = searchParams.url;
  const device = searchParams.device || "desktop";

  if (!url) {
    return <div>No url found</div>;
  }

  const snapshot = await getSnapshot(supabase, projectId, url, device);

  if (!snapshot) {
    return <div>No snapshot found</div>;
  }

  const aggregatedClicks = await getAggregatedClicks(supabase, snapshot.id);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <div className="flex">
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
