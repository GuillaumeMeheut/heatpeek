import { Hono } from "hono";
import type { Env } from "../env";
import { SupabaseService } from "../services/supabase";

const router = new Hono<{ Bindings: Env }>();

router.get("/config", async (c) => {
  const trackingId = c.req.query("id");
  const path = c.req.query("p");

  if (!trackingId || !path) {
    return c.body(null, 204);
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = c.env;
  const supabaseService = new SupabaseService(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const config = await supabaseService.getProjectConfig(trackingId, path);

    if (!config) {
      return c.body(null, 204);
    }

    return c.json(config, 200, {
      "Cache-Control": "public, max-age=60",
    });
  } catch (err) {
    return c.body(null, 204);
  }
});

export default router;
