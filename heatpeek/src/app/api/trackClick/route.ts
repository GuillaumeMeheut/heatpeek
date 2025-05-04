import { addClick, ClickInfos } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validate required fields
    if (!payload.projectId || !payload.url || !payload.element) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format the data to match our ClickInfos type
    const clickData: ClickInfos = {
      project_id: payload.projectId,
      url: payload.url,
      relative_x: payload.relativeX,
      relative_y: payload.relativeY,
      screen_width: payload.screenWidth,
      screen_height: payload.screenHeight,
      timestamp: payload.timestamp,
      element: payload.element,
      class: payload.class,
      id_attr: payload.id,
      user_agent: payload.userAgent,
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
