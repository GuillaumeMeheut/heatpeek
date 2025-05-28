import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
Deno.serve(async (req) => {
  const startInsert = performance.now();
  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON",
      }),
      {
        status: 400,
      }
    );
  }
  if (
    !payload.trackingId ||
    !payload.url ||
    !payload.device ||
    !Array.isArray(payload.events)
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid payload",
      }),
      {
        status: 400,
      }
    );
  }

  const clicks = [];

  for (const event of payload.events) {
    if (!event.s) continue;

    const clickData = {
      tracking_id: payload.trackingId,
      url: payload.url,
      erx: event.erx,
      ery: event.ery,
      timestamp: event.timestamp,
      device: payload.device,
      visible: event.visible,
      s: event.s,
      l: event.l,
      t: event.t,
      w: event.w,
      h: event.h,
      first_click_rank: event.first_click_rank,
    };
    clicks.push(clickData);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );
  const result = await supabase.schema("pgmq_public").rpc("send", {
    queue_name: "clicks",
    message: clicks,
    sleep_seconds: 0,
  });
  const duration = (performance.now() - startInsert).toFixed(2);
  return new Response(
    JSON.stringify({
      message: `Batch sent successfully in ${duration}ms`,
      result,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
    }
  );
});
