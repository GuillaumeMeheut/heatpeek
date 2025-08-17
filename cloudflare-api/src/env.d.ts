import type { KVNamespace } from "@cloudflare/workers-types";
import type { BrowserWorker } from "@cloudflare/puppeteer";
import type { Queue } from "@cloudflare/workers-types";

interface Env {
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CACHE_HEATPEEK: KVNamespace;
  INTERNAL_API_KEY: string;
  ALLOWED_ORIGIN: string;
  CLICKHOUSE_URL: string;
  CLICKHOUSE_USERNAME: string;
  CLICKHOUSE_PASSWORD: string;
  MYBROWSER: BrowserWorker;
  "heatpeek-events": Queue;
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
}

export { Env };
