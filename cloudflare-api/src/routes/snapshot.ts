import { Hono } from "hono";
import { cors } from "hono/cors";
import puppeteer, { Browser } from "@cloudflare/puppeteer";
import type { Env } from "../env";
import { z } from "zod";
import { ProjectConfigError, SupabaseService } from "../services/supabase";
import {
  captureDom,
  createLayoutHash,
  inlineImagesAndBackgrounds,
} from "../utils/screenshot";
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

  try {
    const body = await c.req.json();

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

    const supabaseService = new SupabaseService(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const snapshotInfos = await supabaseService.getSnapshotInfos(
      trackingId,
      path,
      device
    );

    if (
      snapshotInfos === ProjectConfigError.NOT_FOUND ||
      snapshotInfos === ProjectConfigError.FETCH_ERROR
    ) {
      throw new Error("Failed to get snapshot");
    }

    urlId = snapshotInfos.url_id;

    if (!snapshotInfos.should_update) {
      console.error("Snapshot is already up to date");
      return c.text("ok");
    }

    browser = await puppeteer.launch(c.env.MYBROWSER);

    const sanitizedHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    const inlinedHtml = await inlineImagesAndBackgrounds(
      sanitizedHtml,
      originUrl
    );

    const page = await browser.newPage();

    await page.setContent(inlinedHtml, { waitUntil: "load" });

    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
    });

    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) =>
          img.decode().catch(() => {
            // skip broken images
          })
        )
      );
    });

    const pageDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      };
    });

    const visibleDomElements = await captureDom(page);
    const layoutHash = await createLayoutHash(visibleDomElements);

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
    });

    // Convert screenshot buffer to Uint8Array
    const uint8Array =
      typeof screenshotBuffer === "string"
        ? new TextEncoder().encode(screenshotBuffer)
        : new Uint8Array(screenshotBuffer);

    const publicImageUrl = await supabaseService.uploadScreenshot(
      urlId,
      layoutHash,
      uint8Array
    );

    await supabaseService.updateSnapshot(urlId, device, {
      dom_data: JSON.stringify(visibleDomElements),
      layout_hash: layoutHash,
      screenshot_url: publicImageUrl,
      width: pageDimensions.width,
      height: pageDimensions.height,
      should_update: false,
    });

    const deviceFieldMap = {
      desktop: "update_snap_desktop",
      tablet: "update_snap_tablet",
      mobile: "update_snap_mobile",
    } as const;

    const updateField = deviceFieldMap[device];

    await supabaseService.updatePageConfig(urlId, {
      [updateField]: false,
    });

    await c.env.CACHE_HEATPEEK.delete(configKey(trackingId, path));
    await c.env.CACHE_HEATPEEK.delete(snapshotKey(trackingId, path, device));

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("Screenshot error:", error);
    return c.json({ error: "Failed to capture screenshot" }, 500);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

export default router;
