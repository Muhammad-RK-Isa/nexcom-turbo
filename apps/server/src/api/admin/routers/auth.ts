import { signInSchema, createFirstUserSchema } from "@nexcom/validators";
import { lucia } from "../../../auth/lucia";
import { signIn } from "../services/auth.sign-in";
import { createFirstUser } from "../services/auth.create-first-user";
import { createAdminRouter, publicAdminProcedure } from "../trpc";

export const authRouter = createAdminRouter({
  signIn: publicAdminProcedure
    .input(signInSchema)
    .mutation(({ input, ctx }) => signIn(ctx, input)),
  createFirstUser: publicAdminProcedure
    .input(createFirstUserSchema)
    .mutation(({ ctx, input }) => createFirstUser(ctx, input)),
  signOut: publicAdminProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) return;
    await lucia.invalidateSession(ctx.session.id);
    ctx.resHeaders.append(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
    return { success: true };
  }),
  getUser: publicAdminProcedure.query(({ ctx }) => {
    return {user: ctx.user}
    // if (ctx.user?.id)
    //   return {
    //     user: {
    //       id: ctx.user.id,
    //       name: ctx.user.name,
    //       email: ctx.user.email,
    //       avatar: ctx.user.avatar,
    //     }
    //   };
    // return null
  }),
  checkUserExistence: publicAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: (t, { eq }) => eq(t.role, "admin"),
    });
    return { success: !!res }
  })
});
