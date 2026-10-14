import { IdentifierNode } from "kysely-codegen";
import type { Config } from "kysely-codegen";
import { entries, fromEntries } from "remeda";

const TYPES = {
	game: new IdentifierNode("GameId"),
	user: new IdentifierNode("UserId"),
};
// UserId, GameId

const config: Config = {
	customImports: fromEntries(
		entries(TYPES).map(([, value]) => [value.name, "~/server/validation"]),
	),
	outFile: "src/db/database.gen.ts",
	overrides: {
		columns: {
			"games.id": TYPES.game,
			"games.ownerId": TYPES.user,
			"users.id": TYPES.user,
		},
	},
};

export default config;
