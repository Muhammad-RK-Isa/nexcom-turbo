import { users } from "@nexcom/db/schema";
import type { CreateFirstUserInput} from "@nexcom/validators";
import { TRPCError } from "@trpc/server";
import { Scrypt } from "oslo/password";
import postgres from "postgres";
import { lucia } from "../../../auth/lucia";
import type { AdminContext } from "../trpc";

export async function createFirstUser(ctx: AdminContext, input: CreateFirstUserInput) {
  try {
    if (input.password !== input.confirmPassword)
      throw new TRPCError({
        message: "Passwords do not match",
        code: "BAD_REQUEST",
      });
    
    const existingFirstAdminUser = await ctx.db.query.users.findFirst({
      where: (t, { eq }) => eq(t.role, "admin"),
    })

    if (existingFirstAdminUser) 
      throw new TRPCError({
        code: "CONFLICT",
        message: "First admin user already exists",
      })

    const hashedPassword = await new Scrypt().hash(input.password);

    const [newUser] = await ctx.db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: "admin",
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
        message: "Account already exists",
        code: "CONFLICT",
      });
    }
    throw error
  }
}
