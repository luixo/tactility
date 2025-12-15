import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~/pages/index";
import { gamesQueryOptions } from "~/server/handlers/games";

export const Route = createFileRoute("/")({
  component: Page,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(gamesQueryOptions);
  },
});
