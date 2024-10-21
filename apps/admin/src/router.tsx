import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { unstable_httpBatchStreamLink, httpBatchLink } from "@trpc/client";
import { createTRPCReact, createTRPCQueryUtils } from "@trpc/react-query";
import { type AppRouter } from "@nexcom/server";

import { routeTree } from "./routeTree.gen";
import SuperJSON from "superjson";

export const queryClient = new QueryClient();

export const api = createTRPCReact<AppRouter>();

// Unnecessary change

const trpcClient = api.createClient({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: "/api/trpc",
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
      trpc: trpcQueryUtils,
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
