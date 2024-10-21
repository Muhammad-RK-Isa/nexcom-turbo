import "server-only";

import type { AppRouter } from "@nexcom/server";
import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import "server-only";
import SuperJSON from "superjson";

// TODO: Implement new `createTRPCClientProxy` when full documentation is available
export const api = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: "http://localhost:8000/api/trpc",
      transformer: SuperJSON,
    }),
  ],
});
