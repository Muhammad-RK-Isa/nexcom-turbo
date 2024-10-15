import { Link, Outlet, createRootRoute, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { trpcQueryUtils } from '../router'

export interface RouterAppContext {
  trpc: typeof trpcQueryUtils
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
})

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
      </div>
      <hr />
      {isFetching ? (
        <div className='bg-grey-200 w-full text-center'>
          Root Loading...
        </div>
      ) : null}
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
