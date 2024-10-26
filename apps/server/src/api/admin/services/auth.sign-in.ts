import type { SignInInput } from "@nexcom/validators/admin";
import { TRPCError } from "@trpc/server";
import { Scrypt } from "lucia";
import { lucia } from "../../../auth/lucia";
import { getRandomSentence } from "../../../lib/utils";
import type { AdminContext } from "../trpc";

export async function signIn(ctx: AdminContext, input: SignInInput) {
  const user = await ctx.db.query.users.findFirst({
    where: (t, { eq, and }) => and(
      eq(t.email, input.email),
      eq(t.role, "admin"),
    ),
  });

  if (!user)
    throw new TRPCError({
      message: getRandomSentence(),
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
