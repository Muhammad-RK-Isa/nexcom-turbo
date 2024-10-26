import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { join } from "path";
import { adminRouter } from "./api";
import { createAdminContext } from "./api/admin/trpc";
import { handlers } from "./api/uploadthing/router";

const app = new Hono();

app.use(
  "/api/trpc/admin/*",
  trpcServer({
    router: adminRouter,
    createContext: createAdminContext,
    endpoint: "/api/trpc/admin",
  }),
);

app.all("/api/uploadthing", (context) => handlers(context.req.raw));

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
