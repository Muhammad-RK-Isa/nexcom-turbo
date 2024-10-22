import { authRouter } from "./routers";
import { createAdminRouter } from "./trpc";

export const adminRouter = createAdminRouter({
  auth: authRouter,
});

export type AdminRouter = typeof adminRouter;
