import { sql } from "kysely";

export const COMMON = {
	createdAtColumn: "createdAt",
	nowTimestamp: sql`CURRENT_TIMESTAMP`,
	updatedAtColumn: "updatedAt",
};

export const GAMES = {
	INDEXES: {
		OWNER_ID: "games:ownerId:index",
	},
	TABLE: "games",
	TRIGGERS: {
		UPDATE_TIMESTAMP: "games:updateTimestamp",
	},
	TYPES: {
		ID_ALPHABET: "1234567890abcdef",
		ID_LENGTH: 12,
	},
} as const;

export const USERS = {
	TABLE: "users",
	TRIGGERS: {
		UPDATE_TIMESTAMP: "users:updateTimestamp",
	},
	TYPES: {
		NAME_LENGTH: 255,
	},
} as const;

export const FUNCTIONS = {
	UPDATE_TIMESTAMP_COLUMN: "updateTimestampColumn",
} as const;
