import { db } from "@nexcom/db/client";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import SuperJSON from "superjson";

import { ZodError } from "zod";
import { lucia } from "../../auth/lucia";

export const createAdminContext = async (opts: FetchCreateContextFnOptions) => {
  const { req } = opts;
  const cookieHeader = req.headers.get("Cookie") ?? "";

  // Read the session cookie
  const sessionId = lucia.readSessionCookie(cookieHeader);

  let session = null;
  let user = null;

  if (sessionId) {
    try {
      const sessionData = await lucia.validateSession(sessionId);

      session = sessionData.session;
      user = sessionData.user;

      // Refresh session if needed and update the cookie
      if (session && session.fresh) {
        opts.resHeaders.append(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        );
      }
    } catch (error) {
      // If session is invalid, clear the session cookie
      opts.resHeaders.append(
        "Set-Cookie",
        lucia.createBlankSessionCookie().serialize(),
      );
    }
  }
  return {
    db,
    user,
    session,
    ...opts,
  };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createAdminContext>>>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

export const createAdminRouter = t.router;

export const publicAdminProcedure = t.procedure;

export const protectedAdminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    }
  });
});

export type AdminContext = Awaited<ReturnType<typeof createAdminContext>>;
export type ProtectedAdminContext = AdminContext & {
  user: NonNullable<AdminContext["user"]>;
  session: NonNullable<AdminContext["session"]>;
};
