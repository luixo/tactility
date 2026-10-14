import { type Config, IdentifierNode } from "kysely-codegen";
import { entries, fromEntries } from "remeda";

const TYPES = {
	user: new IdentifierNode("UserId"),
	game: new IdentifierNode("GameId"),
};
// UserId, GameId

const config: Config = {
	outFile: "src/db/database.gen.ts",
	customImports: fromEntries(
		entries(TYPES).map(([, value]) => [value.name, "~/server/validation"]),
	),
	overrides: {
		columns: {
			"users.id": TYPES.user,
			"games.id": TYPES.game,
			"games.ownerId": TYPES.user,
		},
	},
};

export default config;
