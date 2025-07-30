import {
  getSnapshot,
  getTrackingIdAndBaseUrl,
  getUser,
} from "@/lib/supabase/queries";
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
} from "@/lib/clickhouse/queries";
import { DeviceEnum, HeatmapType, ParsedDomDataType } from "./types";
import { getClickedElements } from "./utils";
import { FilterBrowserEnum, FilterDateEnum } from "@/components/Filters/types";

export default async function HeatmapPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    url: string;
    device?: DeviceEnum;
    type?: HeatmapType;
    date?: FilterDateEnum;
    browser?: FilterBrowserEnum;
  };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");
  const { id: projectId } = params;
  const url = searchParams.url;
  const device = searchParams.device;
  const date = searchParams.date;
  const browser = searchParams.browser;

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
    !date ||
    !url ||
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

  if (!snapshot.dom_data) {
    return <div>A problem as occured</div>;
  }

  const result = await getTrackingIdAndBaseUrl(supabase, projectId);
  if (!result) {
    return <div>Error</div>;
  }

  let data: RawClick[] | ScrollDepth[] | null = null;

  const [clicks, rageClicks, scrollDepth] = await Promise.all([
    getClicks({
      trackingId: result.tracking_id,
      path: url,
      snapshotId: snapshot.id,
      device,
      browser,
      date,
    }),
    getRageClicks({
      trackingId: result.tracking_id,
      path: url,
      snapshotId: snapshot.id,
      device,
      browser,
      date,
    }),
    getScrollDepth({
      trackingId: result.tracking_id,
      path: url,
      snapshotId: snapshot.id,
      device,
      browser,
      date,
    }),
  ]);

  // Set data based on the selected type
  switch (type) {
    case HeatmapType.Clicks:
      data = clicks;
      break;
    case HeatmapType.RageClicks:
      data = rageClicks;
      break;
    case HeatmapType.ScrollDepth:
      data = scrollDepth;
      break;
    default:
      data = clicks;
  }

  const parsedDomData = JSON.parse(snapshot.dom_data) as ParsedDomDataType;

  const clickedElements = getClickedElements(
    parsedDomData,
    clicks,
    rageClicks,
    scrollDepth,
    snapshot.height ?? 0
  );

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
                    clickedElements={clickedElements}
                    parsedDomData={parsedDomData}
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
