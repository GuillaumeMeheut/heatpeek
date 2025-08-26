import { getTrackingIdAndBaseUrl, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metrics } from "./Metrics";
import { DeviceEnum } from "../heatmap/types";
import {
  getAverageScrollDepth,
  getClickCount,
  getAverageTimeOnPage,
  getPageViewsTimeseries,
  getPageViewsByBrowser,
} from "@/lib/clickhouse/queries";
import { ChartPieLabelCustom } from "@/components/ui/chart-pie-label-custom";
import { ChartLineDefault } from "@/components/ui/chart-line";
import { ChartBarCustom } from "@/components/ui/chart-bar-custom";
import { FilterBrowserEnum, FilterDateEnum } from "@/components/Filters/types";

export default async function PageDashboard({
  searchParams,
  params,
}: {
  searchParams: {
    url?: string;
    device?: DeviceEnum | undefined;
    date?: FilterDateEnum;
    browser?: FilterBrowserEnum;
  };
  params: { id: string };
}) {
  const supabase = await createClient();
  const { user } = await getUser(supabase);
  if (!user) redirect("/signin");

  const { id: projectId } = params;

  const url = searchParams.url;
  const device = searchParams.device;
  const date = searchParams.date;
  const browser = searchParams.browser;

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

  const [pageViewsByBrowser, clicks, scrollDepth, avgTimeOnPage, data] =
    await Promise.all([
      getPageViewsByBrowser({
        trackingId: result.tracking_id,
        path: url,
        device,
        browser,
        date,
      }),
      getClickCount({
        trackingId: result.tracking_id,
        path: url,
        device,
        browser,
        date,
      }),
      getAverageScrollDepth({
        trackingId: result.tracking_id,
        path: url,
        device,
        browser,
        date,
      }),
      getAverageTimeOnPage({
        trackingId: result.tracking_id,
        path: url,
        device,
        browser,
        date,
      }),
      getPageViewsTimeseries({
        trackingId: result.tracking_id,
        path: url,
        device,
        browser,
        date,
      }),
    ]);

  const totalPageViews = pageViewsByBrowser.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 mb-6 ">
      <Metrics
        pageViews={totalPageViews}
        clicks={clicks}
        scrollDepth={scrollDepth}
        avgTimeOnPage={avgTimeOnPage}
      />
      <ChartLineDefault dateRange={date} data={data} />
      <ChartPieLabelCustom data={pageViewsByBrowser} />
      <ChartBarCustom
        categories={[
          { label: "Countries", columnName: "country" },
          { label: "Regions", columnName: "region" },
          { label: "Cities", columnName: "city" },
        ]}
        data={[]}
      />
      <ChartBarCustom
        categories={[
          { label: "Top page", columnName: "page" },
          { label: "Entry page", columnName: "entry_page" },
          { label: "Exit page", columnName: "exit_page" },
        ]}
        data={[]}
      />
    </div>
  );
}
