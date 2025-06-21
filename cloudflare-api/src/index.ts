/// <reference lib="webworker" />
import { Hono } from "hono";
import type { Env } from "./env";
import eventRouter from "./routes/event";
import projectRouter from "./routes/project";

const app = new Hono<{ Bindings: Env }>();

// Mount routes
app.route("/api/project", projectRouter);
app.route("/api/event", eventRouter);

export default app;
