import { createClient } from "@clickhouse/client-web";
import type { ClickHouseEvent } from "../types/clickhouse";
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

  async insertClicks(
    clicks: ClickHouseEvent[],
    maxRetries: number = 3,
    initialDelayMs: number = 200
  ): Promise<boolean | ClickHouseError> {
    if (clicks.length === 0) {
      return true;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const start = Date.now();

        await this.client.insert({
          table: "raw_clicks",
          values: clicks,
          format: "JSONEachRow",
        });

        const elapsed = Date.now() - start;
        console.log(
          ` Inserted ${clicks.length} clicks in ${elapsed}ms (attempt ${attempt})`
        );

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

  async close(): Promise<void> {
    await this.client.close();
  }
}
