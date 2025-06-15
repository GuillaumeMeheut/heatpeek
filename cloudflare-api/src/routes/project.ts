import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import { SupabaseService } from "../services/supabase";

const router = new Hono<{ Bindings: Env }>();

router.get("/config", cors(), async (c) => {
  const trackingId = c.req.query("id");
  const path = c.req.query("p");

  if (!trackingId || !path) {
    return c.body(null, 204);
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIG_CACHE } = c.env;
  const supabaseService = new SupabaseService(SUPABASE_URL, SUPABASE_ANON_KEY);

  // KV key format: t-{trackingId}-p-{path}
  const kvKey = `t-${trackingId}-p-${path}`;

  try {
    // 1. Try reading from KV
    const cached = await CONFIG_CACHE.get(kvKey, { type: "json" });
    if (cached) {
      console.log("cache hit", cached);
      return c.json(cached, 200, {
        "Cache-Control": "public, max-age=60",
        "X-Source": "cache",
      });
    }

    // 2. Fallback to Supabase
    const config = await supabaseService.getProjectConfig(trackingId, path);
    if (!config) {
      return c.body(null, 204);
    }
    console.log("storing in kv", config);
    // 3. Store in KV for 5 minutes
    await CONFIG_CACHE.put(kvKey, JSON.stringify(config), {
      expirationTtl: 300,
    });

    return c.json(config, 200, {
      "Cache-Control": "public, max-age=60",
      "X-Source": "supabase",
    });
  } catch (err) {
    return c.body(null, 204);
  }
});

export default router;
