import { signInSchema, signUpSchema } from "@nexcom/validators/admin";
import { lucia } from "../../../../auth/lucia";
import { signIn } from "../../services/auth.sign-in";
import { signUp } from "../../services/auth.sign-up";
import { createRouter, protectedProcedure, publicProcedure } from "../../trpc";

export const authRouter = createRouter({
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(({ input, ctx }) => signIn(ctx, input)),
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(({ ctx, input }) => signUp(ctx, input)),
  signOut: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) return;
    await lucia.invalidateSession(ctx.session.id);
    ctx.resHeaders.append(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
    return { success: true };
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
