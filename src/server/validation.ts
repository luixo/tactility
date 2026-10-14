import { z } from "zod";
import { GAMES } from "~/db/const";

const inputOutputBrand = <T extends z.core.$ZodType, B extends string>(
	input: T,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_brand: B,
) =>
	input as z.core.$ZodBranded<T, B> &
		Record<"_zod", Record<"input", z.input<T> & z.$brand<B>>>;

export const userIdSchema = inputOutputBrand(z.uuid(), "UserId");
export type UserId = z.infer<typeof userIdSchema>;
export const gameIdSchema = inputOutputBrand(
	z
		.string()
		.length(GAMES.TYPES.ID_LENGTH)
		.regex(new RegExp(`^[${GAMES.TYPES.ID_ALPHABET}]{12}$`)),
	"GameId",
);
export type GameId = z.infer<typeof gameIdSchema>;
