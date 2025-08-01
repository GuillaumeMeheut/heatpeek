import { createClient } from "@clickhouse/client-web";
import type {
  ClickEvent,
  PageViewEvent,
  RageClickEvent,
  ScrollDepthEvent,
  EngagementEvent,
} from "../types/clickhouse";
import { ClickHouseError } from "../types/clickhouse";
import { toClickhouseDateTime } from "../utils/date";

export class ClickHouseService {
  private client;

  constructor(
    private readonly clickhouseUrl: string,
    private readonly clickhouseUsername: string,
    private readonly clickhousePassword: string
  ) {
    this.client = createClient({
      url: this.clickhouseUrl,
      username: this.clickhouseUsername,
      password: this.clickhousePassword,
      request_timeout: 30000,
      compression: {
        response: true,
        request: false,
      },
    });
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await operation();

        return true;
      } catch (error: any) {
        if (attempt === maxRetries) {
          console.error(
            ` Final attempt failed (${attempt}/${maxRetries}):`,
            error
          );
          return ClickHouseError.QUERY_ERROR;
        }

        const delay = initialDelayMs * 2 ** (attempt - 1);
        console.warn(
          `Insert failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return ClickHouseError.QUERY_ERROR;
  }

  async insertClicks(
    clicks: ClickEvent[],
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    if (clicks.length === 0) {
      return true;
    }

    return this.executeWithRetry(
      () =>
        this.client.insert({
          table: "raw_clicks",
          values: clicks,
          format: "JSONEachRow",
        }),
      maxRetries,
      initialDelayMs
    );
  }

  async insertRageClicks(
    rageClicks: RageClickEvent[],
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    if (rageClicks.length === 0) {
      return true;
    }

    return this.executeWithRetry(
      () =>
        this.client.insert({
          table: "raw_rage_clicks",
          values: rageClicks,
          format: "JSONEachRow",
        }),
      maxRetries,
      initialDelayMs
    );
  }

  async insertScrollDepth(
    scrollDepth: ScrollDepthEvent[],
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    if (scrollDepth.length === 0) {
      return true;
    }

    return this.executeWithRetry(
      () =>
        this.client.insert({
          table: "raw_scroll_depth",
          values: scrollDepth,
          format: "JSONEachRow",
        }),
      maxRetries,
      initialDelayMs
    );
  }

  async insertEngagement(
    engagement: EngagementEvent[],
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    if (engagement.length === 0) {
      return true;
    }

    return this.executeWithRetry(
      () =>
        this.client.insert({
          table: "raw_times_on_page",
          values: engagement,
          format: "JSONEachRow",
        }),
      maxRetries,
      initialDelayMs
    );
  }

  async insertPageViews(
    pageViews: PageViewEvent[]
  ): Promise<boolean | ClickHouseError> {
    try {
      if (pageViews.length === 0) {
        return true;
      }
      await this.client.insert({
        table: "raw_pageviews",
        values: pageViews,
        format: "JSONEachRow",
      });
      return true;
    } catch (error) {
      console.error("ClickHouse error insertPageView:", error);
      return ClickHouseError.QUERY_ERROR;
    }
  }

  async getTotalPageviews(
    trackingIdList: string,
    billingStart: Date,
    billingEnd: Date
  ): Promise<number> {
    try {
      const query = `
        SELECT SUM(views) as total_views
        FROM aggregated_pageviews
        WHERE tracking_id IN (${trackingIdList})
        AND date >= '${toClickhouseDateTime(billingStart)}'
        AND date < '${toClickhouseDateTime(billingEnd)}'
      `;

      const result = await this.client.query({
        query,
        format: "JSON",
      });

      const rows = await result.json();
      const data = rows.data as { total_views?: string | number }[];
      return Number(data?.[0]?.total_views) || 0;
    } catch (error) {
      console.error("ClickHouse error getTotalPageviews:", error);
      throw new Error(error as string);
    }
  }

  async insertAllEvents(
    clicks: ClickEvent[],
    rageClicks: RageClickEvent[],
    scrollDepth: ScrollDepthEvent[],
    engagement: EngagementEvent[],
    pageViews: PageViewEvent[]
  ): Promise<boolean | ClickHouseError> {
    try {
      const operations = [];

      if (clicks.length > 0) {
        operations.push(
          this.client.insert({
            table: "raw_clicks",
            values: clicks,
            format: "JSONEachRow",
          })
        );
      }

      if (rageClicks.length > 0) {
        operations.push(
          this.client.insert({
            table: "raw_rage_clicks",
            values: rageClicks,
            format: "JSONEachRow",
          })
        );
      }

      if (scrollDepth.length > 0) {
        operations.push(
          this.client.insert({
            table: "raw_scroll_depth",
            values: scrollDepth,
            format: "JSONEachRow",
          })
        );
      }

      if (engagement.length > 0) {
        operations.push(
          this.client.insert({
            table: "raw_times_on_page",
            values: engagement,
            format: "JSONEachRow",
          })
        );
      }

      if (pageViews.length > 0) {
        operations.push(
          this.client.insert({
            table: "raw_pageviews",
            values: pageViews,
            format: "JSONEachRow",
          })
        );
      }

      // Execute all operations in parallel
      await Promise.all(operations);
      return true;
    } catch (error) {
      console.error("ClickHouse error insertAllEvents:", error);
      return ClickHouseError.QUERY_ERROR;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
