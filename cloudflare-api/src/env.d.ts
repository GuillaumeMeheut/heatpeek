import type { KVNamespace } from "@cloudflare/workers-types";
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  CONFIG_CACHE: KVNamespace;
  INTERNAL_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

export { Env };
