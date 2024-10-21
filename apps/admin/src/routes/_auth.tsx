import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    console.log("Before load");
    try {
      const user = await context.trpc.auth.getUser.ensureData();
      if (user) return;
    } catch (error) {
      throw redirect({
        to: "/sign-in",
        search: { callbackUrl: location.href },
      });
    }
  },
});
