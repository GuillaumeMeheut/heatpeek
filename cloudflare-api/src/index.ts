/// <reference lib="webworker" />
import { Hono } from "hono";
import type { Env } from "./env";
import eventRouter from "./routes/event";
import projectRouter from "./routes/project";
import snapshotRouter from "./routes/snapshot";

const app = new Hono<{ Bindings: Env }>();

app.route("/api/project", projectRouter);
app.route("/api/event", eventRouter);
app.route("/api/snapshot", snapshotRouter);

export default app;
