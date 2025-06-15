import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import { SupabaseService, ProjectConfigError } from "../services/supabase";

const router = new Hono<{ Bindings: Env }>();

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60",
  "X-Source": "supabase",
};

router.get("/config", cors(), async (c) => {
  const trackingId = c.req.query("id");
  const path = c.req.query("p");

  if (!trackingId || !path) {
    return c.body(null, 204);
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIG_CACHE } = c.env;
  const supabaseService = new SupabaseService(SUPABASE_URL, SUPABASE_ANON_KEY);

  const kvKey = `t-${trackingId}-p-${path}`;

  try {
    // 1. Try reading from KV
    const cached = await CONFIG_CACHE.get(kvKey, { type: "json" });

    if (cached) {
      return c.json(cached, 200, CACHE_HEADERS);
    }

    const config = await supabaseService.getProjectConfig(trackingId, path);

    if (config === ProjectConfigError.FETCH_ERROR) {
      return c.body(null, 204);
    }

    await CONFIG_CACHE.put(kvKey, JSON.stringify(config), {
      expirationTtl: 300,
    });

    if (config === ProjectConfigError.NOT_FOUND) {
      return c.body(null, 204);
    }

    return c.json(config, 200, CACHE_HEADERS);
  } catch (err) {
    return c.body(null, 204);
  }
});

export default router;
