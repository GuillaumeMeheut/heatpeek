import type {
  ScheduledController,
  ExecutionContext,
} from "@cloudflare/workers-types";
import type { Env } from "../env";
import { SupabaseService } from "../services/supabase";
import { ClickHouseService } from "../services/clickhouse";
import { subMonths } from "../utils/date";

export const scheduled = async (
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    console.log("Cron job ran at", new Date().toISOString());

    const {
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD,
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    } = env;

    const supabaseService = new SupabaseService(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const clickhouseService = new ClickHouseService(
      CLICKHOUSE_URL,
      CLICKHOUSE_USERNAME,
      CLICKHOUSE_PASSWORD
    );

    const users = await supabaseService.getUsersWithActiveSubscription();

    const userIds = users.map((u) => u.id);

    const projects = await supabaseService.getProjectsByUserIds(userIds);

    const trackingIdsToLock: string[] = [];

    for (const user of users) {
      const { id, pageviews_limit, subscription_current_period_end } = user;
      if (!subscription_current_period_end || pageviews_limit === null)
        continue;

      const billingEnd = new Date(subscription_current_period_end);
      const billingStart = subMonths(billingEnd, 1);

      const userTrackingIds = projects
        .filter((p) => p.user_id === id)
        .map((p) => `'${p.tracking_id}'`);

      if (userTrackingIds.length === 0) continue;

      const trackingList = userTrackingIds.join(",");

      const totalViews = await clickhouseService.getTotalPageviews(
        trackingList,
        billingStart,
        billingEnd
      );

      if (totalViews > pageviews_limit) {
        const exceededTrackingIds = projects
          .filter((p) => p.user_id === id)
          .map((p) => p.tracking_id);

        trackingIdsToLock.push(...exceededTrackingIds);
      }
    }
    await supabaseService.markProjectConfigsAsUsageExceeded(trackingIdsToLock);

    console.log(
      `${trackingIdsToLock.length} trackingIds have been set as usage_exceeded to true`
    );
    console.log("Cron job finished at", new Date().toISOString());
  } catch (error) {
    console.error("Error in checkPageviewsLimit cron job:", error);
  }
};
