import { createFileRoute } from "@tanstack/react-router";
import { api } from "../router";
import { Button } from "@nexcom/ui/components/ui/button";
import { Charts } from "~/components/charts";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <Charts />;
}
