import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact, createTRPCQueryUtils } from "@trpc/react-query";
import { type AdminRouter } from "@nexcom/server";
import SuperJSON from "superjson";

import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export const api = createTRPCReact<AdminRouter>();

const trpcClient = api.createClient({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: "/api/trpc/admin",
      fetch: (url, opts) => {
        return fetch(url, {
          ...opts,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
      trpcQueryUtils,
    },
    defaultPendingComponent: () => (
      <div className={`p-2 text-2xl`}>(Global) Loading...</div>
    ),
    Wrap: function WrapComponent({ children }) {
      return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </api.Provider>
      );
    },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
