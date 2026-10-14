import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { customAlphabet } from "nanoid/non-secure";
import { z } from "zod";
import { getDatabase } from "~/db";
import { GAMES } from "~/db/const";
import { authMiddleware } from "~/server/middlewares";
import { type GameId, gameIdSchema } from "~/server/validation";

export const getGames = createServerFn()
	.middleware([authMiddleware])
	.handler(async () => {
		const db = getDatabase();
		const games = await db.selectFrom("games").select(["games.id"]).execute();
		return games.map(({ id }) => id);
	});

export const gamesQueryOptions = queryOptions({
	queryKey: ["games"],
	queryFn: ({ signal }) => getGames({ signal }),
});

export const getGame = createServerFn()
	.middleware([authMiddleware])
	.inputValidator(z.object({ id: gameIdSchema }))
	.handler(async ({ data }) => {
		const db = getDatabase();
		const game = await db
			.selectFrom("games")
			.select(["games.id", "games.createdAt", "games.ownerId", "games.state"])
			.where("games.id", "=", data.id)
			.executeTakeFirst();
		if (!game) {
			throw notFound();
		}
		return game;
	});

export const getGameQueryOptions = (id: GameId) =>
	queryOptions({
		queryKey: ["game", id],
		queryFn: ({ signal }) => getGame({ signal, data: { id } }),
	});

const nanoid = customAlphabet(GAMES.TYPES.ID_ALPHABET, GAMES.TYPES.ID_LENGTH);

export const putGame = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const db = getDatabase();
		const gameId = nanoid() as GameId;
		const game = await db
			.insertInto("games")
			.values({
				id: gameId,
				ownerId: context.userId,
				state: {},
			})
			.returning([
				"games.id",
				"games.createdAt",
				"games.state",
				"games.ownerId",
			])
			.executeTakeFirstOrThrow();
		return game;
	});

export const putGameMutationOptions = mutationOptions({
	mutationKey: ["game", "put"],
	mutationFn: () => putGame(),
});
