import { authRouter } from "./routers";
import { createRouter } from "./trpc";

export const appRouter = createRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
