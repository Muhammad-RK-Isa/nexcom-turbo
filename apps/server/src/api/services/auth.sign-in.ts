import type { SignInInput } from "@nexcom/validators";
import type { TRPCContext } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Scrypt } from "lucia";
import { lucia } from "../../auth/lucia";

export async function signIn(ctx: TRPCContext, input: SignInInput) {
  const user = await ctx.db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, input.email),
  });

  if (!user)
    throw new TRPCError({
      message: "Account not found. Please sign up.",
      code: "UNAUTHORIZED",
    });

  if (!user?.password)
    throw new TRPCError({
      message: "Incorrect email or password",
      code: "UNAUTHORIZED",
    });

  const validPassword = await new Scrypt().verify(
    user.password,
    input.password,
  );

  if (!validPassword)
    throw new TRPCError({
      message: "Incorrect email or password",
      code: "UNAUTHORIZED",
    });

  const session = await lucia.createSession(user.id, {
    email: user.email,
  });
  const sessionCookie = lucia.createSessionCookie(session.id).serialize();

  ctx.resHeaders.append("Set-Cookie", sessionCookie);

  return { success: true };
}
