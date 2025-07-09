import { getSnapshot, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VersioningButton from "./VersioningButton";
import HeatmapWithOptions from "./HeatmapWithOptions";
import {
  getScrollDepth,
  RawClick,
  getRageClicks,
  getClicks,
  ScrollDepth,
  AggregatedClick,
} from "@/lib/clickhouse/queries";
import { DeviceEnum, HeatmapType } from "./types";

export default async function HeatmapPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { url?: string; device?: DeviceEnum; type?: HeatmapType };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");
  const { id: projectId } = await params;
  const url = searchParams.url;
  const device = searchParams.device;

  let type = searchParams.type;

  if (
    !type ||
    (type !== HeatmapType.Clicks &&
      type !== HeatmapType.RageClicks &&
      type !== HeatmapType.ScrollDepth)
  ) {
    type = HeatmapType.Clicks;
  }

  if (
    !url ||
    url === "all" ||
    !device ||
    (device !== DeviceEnum.Desktop &&
      device !== DeviceEnum.Mobile &&
      device !== DeviceEnum.Tablet)
  ) {
    return <div>Query params are not valid</div>;
  }

  const snapshot = await getSnapshot(supabase, projectId, url, device);

  if (!snapshot) {
    return <div>No snapshot found</div>;
  }

  if (snapshot.screenshot_url === null) {
    return <div>The data is still being processed</div>;
  }

  let data: AggregatedClick[] | RawClick[] | ScrollDepth[] | null = null;

  const fetchers = {
    [HeatmapType.Clicks]: getClicks,
    [HeatmapType.RageClicks]: getRageClicks,
    [HeatmapType.ScrollDepth]: getScrollDepth,
  };

  const fetcher = fetchers[type];

  data = await fetcher({
    snapshotId: snapshot.id,
    device,
    browser: "chrome",
  });

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <VersioningButton urlId={snapshot.url_id} device={device} />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          }
        >
          <Card className="border-primary/20">
            <div className="container mx-auto p-4 relative">
              <div className="w-full">
                <div className="relative min-w-full">
                  <HeatmapWithOptions
                    data={data}
                    type={type}
                    pageData={snapshot}
                    clickType="raw"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}
