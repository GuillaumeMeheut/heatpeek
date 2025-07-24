/// <reference lib="webworker" />
import { Hono } from "hono";
import type { Env } from "./env";
import eventRouter from "./routes/event";
import projectRouter from "./routes/project";
import snapshotRouter from "./routes/snapshot";
import { scheduled as cronJob } from "./crons/checkPageviewsLimit";
import type {
  ScheduledEvent,
  ExecutionContext,
} from "@cloudflare/workers-types";

const app = new Hono<{ Bindings: Env }>();

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
};
