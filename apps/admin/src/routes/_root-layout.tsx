import { SidebarProvider } from '@nexcom/ui/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import RootHeader from '~/components/root-header'
import { RootSidebar } from '~/components/root-sidebar'

export const Route = createFileRoute('/_root-layout')({
  beforeLoad: async ({ context, location }) => {
    const { user } = await context.trpcQueryUtils.auth.getUser.ensureData()
    console.log(user)
    if (user === null) throw redirect({
      to: "/sign-in",
      search: { callbackUrl: location.href }
    })
  },
  component: () => <RootLayoutComponent />,
})

function RootLayoutComponent() {
  return (
    <SidebarProvider>
      <RootSidebar />
      <div className='w-full relative'>
        <RootHeader />
        <Outlet />
      </div>
    </SidebarProvider>
  )
}