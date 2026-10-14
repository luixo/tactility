import type React from "react";
import { Skeleton } from "@heroui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { HeaderPortal } from "~/components/header";
import { suspendedFallback } from "~/components/suspense-wrapper";
import { GameContext } from "~/contexts/game-context";
import { getGameQueryOptions } from "~/server/handlers/games";
import type { GameId } from "~/server/validation";

const GameWrapper = suspendedFallback<{ id: GameId }>(
	({ id }) => {
		const { data: game } = useSuspenseQuery(getGameQueryOptions(id));
		return <GameContext value={game}>{null}</GameContext>;
	},
	<>
		<Skeleton className="h-40 w-full rounded-lg" />
		<Skeleton className="h-40 w-full rounded-lg" />
	</>,
);

export const Page: React.FC<{ id: GameId }> = ({ id }) => {
	const { t } = useTranslation();
	return (
		<>
			<HeaderPortal>
				<h1 className="text-xl font-semibold">
					{t("pages.game.title", { id })}
				</h1>
			</HeaderPortal>
			<GameWrapper id={id} />
		</>
	);
};
