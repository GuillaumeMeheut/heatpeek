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
  getAverageTimeOnPage,
  getPageViewsTimeseries,
} from "@/lib/clickhouse/queries";
import { ChartPieLabelCustom } from "@/components/ui/chart-pie-label-custom";
import { ChartLineDefault } from "@/components/ui/chart-line";
import { ChartBarLabelCustom } from "@/components/ui/char-bar-label-custom";
import { FilterDateEnum } from "@/components/Filters/types";

export default async function PageDashboard({
  searchParams,
  params,
}: {
  searchParams: {
    url?: string;
    device?: DeviceEnum | undefined;
    date?: FilterDateEnum;
  };
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id: projectId } = await params;

  const url = searchParams.url;
  const device = searchParams.device;
  const date = searchParams.date;

  if (
    !date ||
    (device !== undefined &&
      device !== DeviceEnum.Desktop &&
      device !== DeviceEnum.Mobile &&
      device !== DeviceEnum.Tablet)
  ) {
    return <div>Query params are not valid</div>;
  }

  const result = await getTrackingIdAndBaseUrl(supabase, projectId);
  if (!result) {
    return <div>Error</div>;
  }

  const [pageViews, clicks, scrollDepth, avgTimeOnPage] = await Promise.all([
    getPageViews({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
      date,
    }),
    getClickCount({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
      date,
    }),
    getAverageScrollDepth({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
      date,
    }),
    getAverageTimeOnPage({
      trackingId: result.tracking_id,
      path: url,
      device,
      browser: "chrome",
      date,
    }),
  ]);

  const data = await getPageViewsTimeseries({
    trackingId: result.tracking_id,
    path: url,
    device,
    browser: "chrome",
    date,
  });

  //barcharts engagement: pageviews clicks scroll depth rage clicks

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 mb-6 ">
      <Metrics
        pageViews={pageViews}
        clicks={clicks}
        scrollDepth={scrollDepth}
        avgTimeOnPage={avgTimeOnPage}
      />
      <ChartLineDefault dateRange={date} data={data} />
      <ChartPieLabelCustom />
      <ChartBarLabelCustom />
      <TopPage />
    </div>
  );
}
