import { db } from "@nexcom/db/client";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import SuperJSON from "superjson";

import { ZodError } from "zod";
import { lucia } from "../../auth/lucia";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
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
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
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

export const createRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next();
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type ProtectedTRPCContext = TRPCContext & {
  user: NonNullable<TRPCContext["user"]>;
  session: NonNullable<TRPCContext["session"]>;
};
