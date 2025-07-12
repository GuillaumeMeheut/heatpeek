import { createClient } from "@clickhouse/client-web";
import type {
  ClickHouseEvent,
  PageViewEvent,
  RageClickEvent,
  ScrollDepthEvent,
} from "../types/clickhouse";
import { ClickHouseError } from "../types/clickhouse";

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
      clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 1,
        async_insert_max_data_size: "1000000", // 1MB
        async_insert_busy_timeout_ms: 500,
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
    clicks: ClickHouseEvent[],
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

  async insertPageView(
    pageViews: PageViewEvent[]
  ): Promise<boolean | ClickHouseError> {
    try {
      if (pageViews.length === 0) {
        return true;
      }
      await this.client.insert({
        table: "raw_pageviews",
        values: [pageViews],
        format: "JSONEachRow",
      });
      return true;
    } catch (error) {
      console.error("ClickHouse error insertPageView:", error);
      return ClickHouseError.QUERY_ERROR;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
