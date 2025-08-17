import { Hono } from "hono";
import { cors } from "hono/cors";
import puppeteer, { Browser } from "@cloudflare/puppeteer";
import type { Env } from "../env";
import { z } from "zod";
import { SupabaseService } from "../services/supabase";
import {
  captureDom,
  createLayoutHash,
  inlineContents,
} from "../utils/screenshot";
import {
  createPerformanceTracker,
  measureStep,
  finalizeMetrics,
  logPerformance,
} from "../utils";
import { configKey, snapshotKey } from "../KV/key";
import { getUA, parseUserAgent } from "../utils/userAgent";
import { Cloudflare } from "cloudflare";

const router = new Hono<{ Bindings: Env }>();

const SnapshotRequestSchema = z.object({
  trackingId: z.string(),
  url: z.string().url(),
  device: z.enum(["desktop", "tablet", "mobile"]),
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

    const { trackingId, url, device, snapshot } = result.data;
    const { html, viewport } = snapshot;

    const ua = getUA(c);
    const { browser: browserUserAgent } = parseUserAgent(ua);

    if (!device || !browserUserAgent || browserUserAgent !== "chrome") {
      console.error("Missing device or browser from user agent");
      return c.text("ok");
    }

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

    // Remove scripts
    let sanitizedHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );

    function absolutifyUrls(html: string, baseUrl: string): string {
      // 1. Rewrite HTML attributes (src, href)
      html = html.replace(
        /(src|href)=["'](\/[^"']*)["']/g,
        (_, attr, path) => `${attr}="${new URL(path, baseUrl).href}"`
      );

      // 2. Rewrite inline style attributes (background-image, etc.)
      html = html.replace(/style=["']([^"']*)["']/g, (match, styleContent) => {
        const fixed = styleContent.replace(
          /url\((['"]?)(\/[^'")]+)\1\)/g,
          (_, q, path) => `url("${new URL(path, baseUrl).href}")`
        );
        return `style="${fixed}"`;
      });

      // 3. Rewrite CSS inside <style> tags
      html = html.replace(
        /<style[^>]*>([\s\S]*?)<\/style>/gi,
        (match, cssContent) => {
          const fixedCss = cssContent.replace(
            /url\((['"]?)(\/[^'")]+)\1\)/g,
            (_, q, path) => `url("${new URL(path, baseUrl).href}")`
          );
          return `<style>${fixedCss}</style>`;
        }
      );

      return html;
    }

    const fixedHtml = absolutifyUrls(sanitizedHtml, "https://heatpeek.com");

    const client = new Cloudflare({
      apiToken: c.env.CF_API_TOKEN,
    });

    const cloudflareSnapshot = await client.browserRendering.snapshot.create({
      account_id: c.env.CF_ACCOUNT_ID,
      html: fixedHtml,
      // url: "https://heatpeek.com/01f1160d-61fd-48b6-855b-6981ceb9cfb1/dashboard",
      // gotoOptions: {
      //   waitUntil: "networkidle0",
      // },
      setJavaScriptEnabled: false,
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      screenshotOptions: {
        fullPage: true,
      },
    });

    // Convert Base64 screenshot to binary
    const screenshotBuffer = Buffer.from(
      cloudflareSnapshot.screenshot,
      "base64"
    );

    // Return as an image
    const response = new Response(screenshotBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": screenshotBuffer.length.toString(),
        "Content-Disposition": "inline; filename=screenshot.png", // optional
      },
    });

    return response;

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

    const updateField = deviceFieldMap[device as keyof typeof deviceFieldMap];

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
