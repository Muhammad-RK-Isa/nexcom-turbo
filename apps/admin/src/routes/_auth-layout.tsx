import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { authRouteSearchSchema } from '~/lib/validators'

export const Route = createFileRoute('/_auth-layout')({
  validateSearch: zodSearchValidator(authRouteSearchSchema),
  beforeLoad: async ({ context, search }) => {
    const { user } = await context.trpcQueryUtils.auth.getUser.ensureData()
    console.log(user)
    if(user !== null) throw redirect({to: search.callbackUrl  })
  },
  component: () => < AuthLayoutComponent />,
})

function AuthLayoutComponent() {
  return (
    <div className="relative grid bg-fixed bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2]">
      <div className="z-10 grid min-h-screen place-items-center p-4">
        <Outlet />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  )
}