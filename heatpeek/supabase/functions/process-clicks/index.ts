import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
Deno.serve(async (req) => {
  const startTime = performance.now();
  const timings: Record<string, number> = {};

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  try {
    const readStart = performance.now();
    const { data: messages, error } = await supabase
      .schema("pgmq_public")
      .rpc("read", {
        n: 50,
        queue_name: "clicks",
        sleep_seconds: 0,
      });
    timings.read_messages = performance.now() - readStart;

    if (error) throw new Error(error.message);
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No messages to process",
          timings: {
            total: performance.now() - startTime,
            ...timings,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const processStart = performance.now();
    const inserts = [];
    const msgIdsToDelete = [];
    for (const msg of messages) {
      const { msg_id, message } = msg;
      msgIdsToDelete.push(msg_id);
      inserts.push(...message);
    }
    timings.process_messages = performance.now() - processStart;

    const insertStart = performance.now();
    const { error: insertError } = await supabase
      .from("clicks")
      .insert(inserts);
    timings.insert_clicks = performance.now() - insertStart;

    if (insertError) throw new Error(insertError.message);

    const deleteStart = performance.now();
    // Delete messages from the queue
    for (const msgId of msgIdsToDelete) {
      const { error: deleteError } = await supabase
        .schema("pgmq_public")
        .rpc("delete", {
          queue_name: "clicks",
          message_id: msgId,
        });
      if (deleteError) {
        console.error(`Failed to delete msg_id ${msgId}:`, deleteError.message);
      }
    }
    timings.delete_messages = performance.now() - deleteStart;

    return new Response(
      JSON.stringify({
        message: "Processed and deleted messages successfully",
        processed_clicks: inserts.length,
        deleted_messages: msgIdsToDelete.length,
        timings: {
          total: performance.now() - startTime,
          ...timings,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
        timings: {
          total: performance.now() - startTime,
          ...timings,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
