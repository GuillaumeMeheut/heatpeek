import { addClicks, ClickInfos } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Payload tracking click:", payload);

    // Validate required fields
    if (!payload.trackingId || !Array.isArray(payload.events)) {
      return new Response(
        JSON.stringify({ error: "Missing trackingId or events array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createClient();
    let errorCount = 0;
    const errors = [];
    const clickDataArray: ClickInfos[] = [];

    for (const event of payload.events) {
      if (!event.url || !event.s) {
        errorCount++;
        errors.push({ event, error: "Missing required fields in event" });
        continue;
      }
      const clickData: ClickInfos = {
        trackingId: payload.trackingId,
        url: event.url,
        erx: event.erx,
        ery: event.ery,
        timestamp: event.timestamp,
        device: event.device,
        visible: event.visible,
        s: event.s,
        l: event.l,
        t: event.t,
        w: event.w,
        h: event.h,
      };
      clickDataArray.push(clickData);
    }

    let successCount = 0;
    if (clickDataArray.length > 0) {
      try {
        await addClicks(supabase, clickDataArray);
        successCount = clickDataArray.length;
      } catch (err) {
        errorCount += clickDataArray.length;
        errors.push({ error: err instanceof Error ? err.message : err });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${successCount} clicks, ${errorCount} errors`,
        errors,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error tracking click:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while processing the request.";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
