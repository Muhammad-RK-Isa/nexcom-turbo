import { Button } from "@nexcom/ui/components/ui/button";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { api, trpcQueryUtils } from "~/router";

export const Route = createFileRoute("/_auth/profile")({
  component: () => <Profile />,
});

function Profile() {
  const { data: user } = api.auth.getUser.useQuery();
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <div className="p-4">
      Profile
      <br />
      Name: {user?.name}
      <br />
      Email: {user?.email}
      <br />
      Role: {user?.role}
      <br />
      <Button
        variant="outline"
        onClick={async () => {
          await trpcQueryUtils.auth.signOut.fetch();
          await trpcQueryUtils.auth.getUser.invalidate();
          await navigate({ to: "/sign-in" });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
