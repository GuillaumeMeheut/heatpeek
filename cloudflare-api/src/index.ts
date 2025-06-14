/// <reference lib="webworker" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import projectRouter from "./routes/project";

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use("*", cors());

// Mount routes
app.route("/api/project", projectRouter);

export default app;
