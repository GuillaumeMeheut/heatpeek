import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../env";
import { SupabaseService, SupabaseError } from "../services/supabase";
import {
  getConfigCache,
  setConfigCache,
  configKey,
  snapshotKey,
} from "../KV/key";
import { detectBot, getUA } from "../utils/userAgent";

const router = new Hono<{ Bindings: Env }>();

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60",
  "X-Source": "supabase",
};

// Filter config to only include the relevant update flag as snapshot_update
function filterConfigByDevice(config: any, device: string) {
  if (!config || !config.page_config) {
    return config;
  }

  const deviceFieldMap = {
    desktop: "update_snap_desktop",
    tablet: "update_snap_tablet",
    mobile: "update_snap_mobile",
  } as const;

  const updateField = deviceFieldMap[device as keyof typeof deviceFieldMap];
  const shouldUpdate = config.page_config[updateField] || false;

  // Create a filtered page_config with only the relevant update flag as snapshot_update
  const {
    update_snap_desktop,
    update_snap_tablet,
    update_snap_mobile,
    ...otherConfig
  } = config.page_config;

  const filteredPageConfig = {
    ...otherConfig,
    snapshot_update: shouldUpdate,
  };

  return {
    ...config,
    page_config: filteredPageConfig,
  };
}

router.get("/config", cors(), async (c) => {
  const trackingId = c.req.query("id");
  const path = c.req.query("p");
  const device = c.req.query("d");

  if (!trackingId || !path || !device) {
    return c.body(null, 204);
  }

  const ua = getUA(c);

  if (detectBot(ua)) {
    return c.body(null, 204);
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CACHE_HEATPEEK } = c.env;

  const supabaseService = new SupabaseService(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const cachedConfig = await getConfigCache(trackingId, path, CACHE_HEATPEEK);

    if (cachedConfig) {
      if (cachedConfig === "__NOT_FOUND__") {
        return c.body(null, 200, CACHE_HEADERS);
      }

      const filteredConfig = filterConfigByDevice(cachedConfig, device);
      return c.json(filteredConfig, 200, CACHE_HEADERS);
    }

    const config = await supabaseService.getProjectConfigByPath(
      trackingId,
      path
    );

    if (config === SupabaseError.FETCH_ERROR) {
      return c.body(null, 204);
    }

    if (config === SupabaseError.NOT_FOUND) {
      await setConfigCache(trackingId, path, null, CACHE_HEATPEEK);
      return c.body(null, 204);
    }

    // Cache the full config (unfiltered)
    await setConfigCache(trackingId, path, config, CACHE_HEATPEEK);

    const filteredConfig = filterConfigByDevice(config, device);
    return c.json(filteredConfig, 200, CACHE_HEADERS);
  } catch (err) {
    console.error(err);
    return c.body(null, 204);
  }
});

const dynamicCors = (origin: string) =>
  cors({
    origin,
  });

router.delete(
  "/config/purge",
  async (c, next) => {
    const origin = c.env.ALLOWED_ORIGIN;
    const corsMiddleware = dynamicCors(origin);
    await corsMiddleware(c, next);
  },
  async (c) => {
    const secret = c.env.INTERNAL_API_KEY;
    const provided = c.req.header("x-api-key");

    if (provided !== secret) {
      return c.body("Unauthorized", 401);
    }

    const body = await c.req.json();
    const { id: trackingId, p: path } = body;

    if (!trackingId || !path) {
      return c.body("Missing id or path", 400);
    }

    await c.env.CACHE_HEATPEEK.delete(configKey(trackingId, path));

    return c.json({ success: true });
  }
);

router.delete(
  "/snapshot/purge",
  async (c, next) => {
    const origin = c.env.ALLOWED_ORIGIN;
    const corsMiddleware = dynamicCors(origin);
    await corsMiddleware(c, next);
  },
  async (c) => {
    const secret = c.env.INTERNAL_API_KEY;
    const provided = c.req.header("x-api-key");

    if (provided !== secret) {
      return c.body("Unauthorized", 401);
    }

    const body = await c.req.json();
    const { id: trackingId, p: path, d: device } = body;

    if (!trackingId || !path || !device) {
      return c.body("Missing id, path or device", 400);
    }

    if (device === "all") {
      await c.env.CACHE_HEATPEEK.delete(
        snapshotKey(trackingId, path, "desktop")
      );
      await c.env.CACHE_HEATPEEK.delete(
        snapshotKey(trackingId, path, "mobile")
      );
      await c.env.CACHE_HEATPEEK.delete(
        snapshotKey(trackingId, path, "tablet")
      );
    } else {
      await c.env.CACHE_HEATPEEK.delete(snapshotKey(trackingId, path, device));
    }

    return c.json({ success: true });
  }
);

export default router;
