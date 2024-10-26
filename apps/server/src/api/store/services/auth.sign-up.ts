import { users } from "@nexcom/db/schema";
import type { SignUpInput } from "@nexcom/validators/admin";
import { TRPCError } from "@trpc/server";
import { Scrypt } from "lucia";
import postgres from "postgres";
import { lucia } from "../../../auth/lucia";
import type { TRPCContext } from "../trpc";

export async function signUp(ctx: TRPCContext, input: SignUpInput) {
  try {
    if (input.password !== input.confirmPassword)
      throw new TRPCError({
        message: "Passwords do not match",
        code: "BAD_REQUEST",
      });

    const hashedPassword = await new Scrypt().hash(input.password);

    const [newUser] = await ctx.db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      })
      .returning();

    const session = await lucia.createSession(newUser.id, {
      email: newUser.email,
    });
    const sessionCookie = lucia.createSessionCookie(session.id).serialize();

    ctx.resHeaders.append("Set-Cookie", sessionCookie);

    return { success: true };
  } catch (error) {
    if (error instanceof postgres.PostgresError && error.code === "23505") {
      throw new TRPCError({
        message: "Email already exists",
        code: "CONFLICT",
      });
    }
    // console.log(error)
    throw new TRPCError({
      message: "Something went wrong!",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}
