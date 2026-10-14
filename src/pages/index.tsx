import React from "react";
import { Button, Card, Input, Skeleton } from "@heroui/react";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "~/components/error-message";
import { suspendedFallback } from "~/components/suspense-wrapper";
import { GAMES } from "~/db/const";
import { updateCache } from "~/hooks/use-update-cache";
import {
	gamesQueryOptions,
	getGameQueryOptions,
	putGameMutationOptions,
} from "~/server/handlers/games";
import type { GameId } from "~/server/validation";

const PreviousGame: React.FC<{
	gameId: GameId;
}> = ({ gameId }) => {
	const { t } = useTranslation();
	const router = useRouter();
	const { data: game } = useSuspenseQuery(getGameQueryOptions(gameId));
	const timestamp = new Date(game.createdAt);
	return (
		<Button
			onPress={() =>
				router.navigate({ params: { id: game.id }, to: "/games/$id" })
			}
		>
			{t("pages.index.resumeGame.button", {
				date: new Intl.DateTimeFormat("en").format(timestamp),
			})}
		</Button>
	);
};

const PreviousGamesCardWrapper: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const { t } = useTranslation();
	return (
		<Card>
			<Card.Content className="flex flex-col gap-2">
				<h2 className="text-2xl leading-normal font-semibold">
					{t("pages.index.resumeGame.title")}
				</h2>
				{children}
			</Card.Content>
		</Card>
	);
};

const PreviousGamesCard = suspendedFallback(
	() => {
		const { data: gameIds } = useSuspenseQuery(gamesQueryOptions);
		if (gameIds.length === 0) {
			return null;
		}
		return (
			<PreviousGamesCardWrapper>
				{gameIds.map((gameId) => (
					<PreviousGame key={gameId} gameId={gameId} />
				))}
			</PreviousGamesCardWrapper>
		);
	},
	<PreviousGamesCardWrapper>
		{Array.from({ length: 3 }).map((_, index) => (
			// oxlint-disable-next-line react/no-array-index-key
			<Skeleton key={index} className="h-10 w-full rounded-lg" />
		))}
	</PreviousGamesCardWrapper>,
);

const CreateGameCard = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const queryClient = useQueryClient();
	const createGameMutation = useMutation({
		...putGameMutationOptions,
		onSuccess: (game) => {
			updateCache(
				queryClient,
				gamesQueryOptions,
			)((prevGames) => [...prevGames, game.id]);
			updateCache(queryClient, getGameQueryOptions(game.id))(game);
			return router.navigate({ params: { id: game.id }, to: "/games/$id" });
		},
	});
	return (
		<Card>
			<Card.Content className="flex flex-col gap-2">
				<h2 className="text-2xl leading-normal font-semibold">
					{t("pages.index.createGame.title")}
				</h2>
				<Button
					variant={createGameMutation.status === "error" ? "danger" : "primary"}
					onPress={() => createGameMutation.mutate()}
					isDisabled={
						createGameMutation.status === "pending" ||
						createGameMutation.status === "success"
					}
					isPending={createGameMutation.status === "pending"}
				>
					{createGameMutation.status === "error"
						? t("common.tryAgain")
						: createGameMutation.status === "success"
							? t("pages.index.createGame.success")
							: t("pages.index.createGame.button")}
				</Button>
				{createGameMutation.status === "error" ? (
					<ErrorMessage error={createGameMutation.error} />
				) : null}
			</Card.Content>
		</Card>
	);
};

const JoinGameCard = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const [slug, setSlug] = React.useState("");
	return (
		<Card>
			<Card.Content className="flex flex-col gap-2">
				<h2 className="text-2xl leading-normal font-semibold">
					{t("pages.index.joinGame.title")}
				</h2>
				<Input
					aria-label={t("pages.index.joinGame.inputLabel")}
					placeholder={t("pages.index.joinGame.inputLabel")}
					value={slug}
					onChange={(event) => setSlug(event.currentTarget.value)}
					maxLength={GAMES.TYPES.ID_LENGTH}
				/>
				<Button
					variant="primary"
					onPress={() => {
						if (slug.length !== GAMES.TYPES.ID_LENGTH) {
							return;
						}
						return router.navigate({ params: { id: slug }, to: "/games/$id" });
					}}
					isDisabled={!slug}
				>
					{t("pages.index.joinGame.button")}
				</Button>
			</Card.Content>
		</Card>
	);
};

export const Page = () => (
	<div className="flex flex-col gap-4">
		<CreateGameCard />
		<JoinGameCard />
		<PreviousGamesCard />
	</div>
);
