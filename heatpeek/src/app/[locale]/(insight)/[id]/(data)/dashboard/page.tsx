import { getTrackingIdAndBaseUrl, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metrics } from "./Metrics";
import { TopPage } from "./TopPage";
import { DeviceEnum } from "../heatmap/types";
import {
  getAverageScrollDepth,
  getClickCount,
  getPageViews,
} from "@/lib/clickhouse/queries";
import { ChartPieLabelCustom } from "@/components/ui/chart-pie-label-custom";
import { ChartLineDefault } from "@/components/ui/chart-line";
import { ChartBarLabelCustom } from "@/components/ui/char-bar-label-custom";

export default async function PageDashboard({
  searchParams,
  params,
}: {
  searchParams: { url?: string; device?: DeviceEnum };
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id: projectId } = await params;

  const url = searchParams.url;
  const device = searchParams.device;

  if (
    !url ||
    !device ||
    (device !== DeviceEnum.Desktop &&
      device !== DeviceEnum.Mobile &&
      device !== DeviceEnum.Tablet &&
      device !== "all")
  ) {
    return <div>Query params are not valid</div>;
  }

  const result = await getTrackingIdAndBaseUrl(supabase, projectId);
  if (!result) {
    return <div>Error</div>;
  }

  const [pageViews, clicks, scrollDepth] = await Promise.all([
    getPageViews({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
    }),
    getClickCount({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
    }),
    getAverageScrollDepth({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
    }),
  ]);

  //barcharts engagement: pageviews clicks scroll depth rage clicks

  //Linecharts pageview by split by date e.g if filter last 24 hours I split by 1 hour

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 mb-6 ">
      <Metrics
        pageViews={pageViews}
        clicks={clicks}
        scrollDepth={scrollDepth}
      />
      <ChartLineDefault />
      <ChartPieLabelCustom />
      <ChartBarLabelCustom />
      <TopPage />
    </div>
  );
}
