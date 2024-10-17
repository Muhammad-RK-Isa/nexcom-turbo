import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useMediaQuery } from "usehooks-ts";

import { trpcQueryUtils } from "../router";
import { Toaster } from "@nexcom/ui/components/ui/sonner";

export interface RouterAppContext {
  trpc: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
});

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <div className="font-poppins">
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
        <Link
          to="/profile"
          activeProps={{
            className: "font-bold",
          }}
        >
          Profile
        </Link>
        <Link
          to="/sign-in"
          activeProps={{
            className: "font-bold",
          }}
        >
          Sign in
        </Link>
      </div>
      <hr />
      {isFetching ? (
        <div className="bg-grey-200 w-full text-center">Root Loading...</div>
      ) : null}
      <Outlet />
      <Toaster richColors={true} expand={isDesktop} />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools position="left" buttonPosition="bottom-left" />
    </div>
  );
}
