import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useMediaQuery } from "usehooks-ts";

import { trpcQueryUtils } from "../router";
import { Toaster } from "@nexcom/ui/components/ui/sonner";
import { TooltipProvider } from "@nexcom/ui/components/ui/tooltip";
import { useTheme } from "~/components/theme-provider";

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
});

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const { theme } = useTheme()

  return (
    <TooltipProvider>
      {isFetching ? (
        <div className='w-full text-center'>
          Root loading...
        </div>
      ) : null}
      <Outlet />
      <Toaster
        theme={theme}
        richColors
        expand={isDesktop}
      />
      <ReactQueryDevtools position='right' buttonPosition='top-right' />
      <TanStackRouterDevtools position="bottom-right" />
    </TooltipProvider>
  )
}
