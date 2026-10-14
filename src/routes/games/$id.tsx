import { createFileRoute, redirect } from "@tanstack/react-router";
import { Page } from "~/pages/game";
import { getGameQueryOptions } from "~/server/handlers/games";
import type { GameId } from "~/server/validation";

const Wrapper = () => {
	const { id } = Route.useParams();
	return <Page id={id as GameId} />;
};
export const Route = createFileRoute("/games/$id")({
	component: Wrapper,
	loader: async ({ params, context }) => {
		try {
			await context.queryClient.fetchQuery(
				getGameQueryOptions(params.id as GameId),
			);
		} catch {
			throw redirect({ to: "/" });
		}
	},
});
