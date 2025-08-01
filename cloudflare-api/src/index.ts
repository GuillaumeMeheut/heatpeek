/// <reference lib="webworker" />
/// <reference lib="webworker" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { Env } from "./env";
import type {
  ScheduledEvent,
  ExecutionContext,
} from "@cloudflare/workers-types";
import type { MessageBatch } from "@cloudflare/workers-types";
import eventRouter from "./routes/event";
import projectRouter from "./routes/project";
import snapshotRouter from "./routes/snapshot";
import { scheduled as cronJob } from "./crons/checkPageviewsLimit";
import { processBatchEvents } from "./queue/eventProcessor";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

app.route("/api/project", projectRouter);
app.route("/api/event", eventRouter);
app.route("/api/snapshot", snapshotRouter);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  async scheduled(controller: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    return cronJob(controller, env, ctx);
  },
  async queue(batch: MessageBatch<any>, env: Env) {
    console.log(`Processing ${batch.messages.length} messages from queue`);

    // Collect all event messages
    const eventMessages = [];

    for (const message of batch.messages) {
      try {
        const queueMessage = message.body;

        if (!queueMessage || !queueMessage.type) {
          console.warn("Invalid queue message format:", queueMessage);
          continue;
        }

        if (queueMessage.type === "event") {
          eventMessages.push(queueMessage);
        } else {
          console.warn("Unknown queue message type:", queueMessage.type);
        }
      } catch (error) {
        console.error("Error processing queue message:", error);
      }
    }

    // Process all events in a single batch if we have any
    if (eventMessages.length > 0) {
      try {
        await processBatchEvents(eventMessages, env);
      } catch (error) {
        console.error("Error processing batch events:", error);
      }
    }

    console.log("Finished processing queue batch");
  },
};
