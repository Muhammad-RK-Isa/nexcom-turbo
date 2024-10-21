import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { trpcServer } from "@hono/trpc-server";
import { createTRPCContext } from "./api/trpc";
import { appRouter } from "./api";
import { join } from "path";

const app = new Hono();

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
    endpoint: "/api/trpc",
  }),
);

app.get("*", serveStatic({ root: join(process.cwd(), "../admin/dist") }));
app.get(
  "*",
  serveStatic({ path: join(process.cwd(), "../admin/dist/index.html") }),
);

Bun.serve({
  port: process.env["PORT"] || 8000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});
