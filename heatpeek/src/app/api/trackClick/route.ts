import { addClick, ClickInfos } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("Payload:", payload);

    // Validate required fields
    if (!payload.projectId || !payload.url || !payload.s) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format the data to match our ClickInfos type
    const clickData: ClickInfos = {
      project_id: payload.projectId,
      url: payload.url,
      erx: payload.erx,
      ery: payload.ery,
      timestamp: payload.timestamp,
      device: payload.device,
      visible: payload.visible,
      s: payload.s,
      l: payload.l,
      t: payload.t,
      w: payload.w,
      h: payload.h,
    };

    console.log("Inserting click data:", clickData);

    const supabase = await createClient();
    await addClick(supabase, clickData);

    return new Response(
      JSON.stringify({ success: true, message: "Click tracked successfully" }),
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
