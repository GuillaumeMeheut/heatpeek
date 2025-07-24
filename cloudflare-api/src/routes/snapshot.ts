import { Hono } from "hono";
import { cors } from "hono/cors";
import puppeteer, { Browser } from "@cloudflare/puppeteer";
import type { Env } from "../env";
import { z } from "zod";
import { SupabaseService, SupabaseError } from "../services/supabase";
import {
  captureDom,
  createLayoutHash,
  inlineImagesAndBackgrounds,
} from "../utils/screenshot";
import {
  createPerformanceTracker,
  measureStep,
  finalizeMetrics,
  logPerformance,
} from "../utils";
import { configKey, snapshotKey } from "../KV/key";

const router = new Hono<{ Bindings: Env }>();

const SnapshotRequestSchema = z.object({
  trackingId: z.string(),
  device: z.enum(["desktop", "tablet", "mobile"]),
  url: z.string().url(),
  snapshot: z.object({
    html: z.string(),
    viewport: z.object({
      width: z.number(),
      height: z.number(),
    }),
  }),
});

// Handle OPTIONS requests for CORS preflight
router.options("/", cors());

router.post("/", cors(), async (c) => {
  let browser: Browser | null = null;
  const metrics = createPerformanceTracker();

  try {
    const body = await measureStep(metrics, "parse_body", async () =>
      c.req.json()
    );

    const result = SnapshotRequestSchema.safeParse(body);

    if (!result.success) {
      throw new Error("Invalid request body");
    }

    const { trackingId, device, url, snapshot } = result.data;
    const { html, viewport } = snapshot;

    let urlId: string | null = null;

    const referer = c.req.header("referer");

    if (!referer) {
      console.error("Missing referer header");
      return c.text("ok");
    }

    const baseUrl = new URL(url).origin;
    const originUrl = new URL(referer).origin;

    if (originUrl !== baseUrl) {
      console.error("Invalid referer", originUrl, baseUrl);
      return c.text("ok");
    }

    const path = new URL(url).pathname;

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = c.env;

    const supabaseService = await measureStep(
      metrics,
      "init_supabase_service",
      async () => new SupabaseService(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    );

    const snapshotInfos = await measureStep(
      metrics,
      "get_snapshot_infos",
      async () => supabaseService.getSnapshotInfos(trackingId, path, device)
    );

    urlId = snapshotInfos.url_id;

    if (!snapshotInfos.should_update) {
      console.error("Snapshot is already up to date");
      return c.text("ok");
    }

    browser = await measureStep(metrics, "launch_browser", async () =>
      puppeteer.launch(c.env.MYBROWSER)
    );

    const sanitizedHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    const inlinedHtml = await measureStep(
      metrics,
      "inline_images_and_backgrounds",
      async () => inlineImagesAndBackgrounds(sanitizedHtml, originUrl)
    );

    const page = await measureStep(metrics, "new_page", async () =>
      browser!.newPage()
    );

    await measureStep(metrics, "set_content", async () =>
      page.setContent(inlinedHtml, { waitUntil: "load" })
    );

    await measureStep(metrics, "set_viewport", async () =>
      page.setViewport({ width: viewport.width, height: viewport.height })
    );

    await measureStep(metrics, "wait_fonts", async () =>
      page.evaluate(async () => {
        await document.fonts.ready;
      })
    );

    await measureStep(metrics, "wait_images", async () =>
      page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
          images.map((img) =>
            img.decode().catch(() => {
              // skip broken images
            })
          )
        );
      })
    );

    const pageDimensions = await measureStep(
      metrics,
      "get_page_dimensions",
      async () =>
        page.evaluate(() => {
          return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
          };
        })
    );

    const visibleDomElements = await measureStep(
      metrics,
      "capture_dom",
      async () => captureDom(page)
    );
    const layoutHash = await measureStep(
      metrics,
      "create_layout_hash",
      async () => createLayoutHash(visibleDomElements)
    );

    const screenshotBuffer = await measureStep(
      metrics,
      "take_screenshot",
      async () => page.screenshot({ fullPage: true })
    );

    // Convert screenshot buffer to Uint8Array
    const uint8Array =
      typeof screenshotBuffer === "string"
        ? new TextEncoder().encode(screenshotBuffer)
        : new Uint8Array(screenshotBuffer);

    const publicImageUrl = await measureStep(
      metrics,
      "upload_screenshot",
      async () =>
        supabaseService.uploadScreenshot(urlId, layoutHash, uint8Array)
    );

    await measureStep(metrics, "update_snapshot", async () =>
      supabaseService.updateSnapshot(urlId, device, {
        dom_data: JSON.stringify(visibleDomElements),
        layout_hash: layoutHash,
        screenshot_url: publicImageUrl,
        width: pageDimensions.width,
        height: pageDimensions.height,
        should_update: false,
      })
    );

    const deviceFieldMap = {
      desktop: "update_snap_desktop",
      tablet: "update_snap_tablet",
      mobile: "update_snap_mobile",
    } as const;

    const updateField = deviceFieldMap[device];

    await measureStep(metrics, "update_page_config", async () =>
      supabaseService.updatePageConfig(urlId, {
        [updateField]: false,
      })
    );

    await measureStep(metrics, "clear_cache", async () => {
      await c.env.CACHE_HEATPEEK.delete(configKey(trackingId, path));
      await c.env.CACHE_HEATPEEK.delete(snapshotKey(trackingId, path, device));
    });

    finalizeMetrics(metrics);
    logPerformance(metrics, "Snapshot API");

    return c.json({ success: true }, 200);
  } catch (error) {
    finalizeMetrics(metrics);
    logPerformance(metrics, "Snapshot API ERROR");
    console.error("Screenshot error:", error, metrics);
    return c.json({ error: "Failed to capture screenshot" }, 500);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

export default router;
