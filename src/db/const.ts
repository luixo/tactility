import { sql } from "kysely";

export const COMMON = {
  createdAtColumn: "createdAt",
  updatedAtColumn: "updatedAt",
  nowTimestamp: sql`CURRENT_TIMESTAMP`,
};

export const GAMES = {
  TABLE: "games",
  TYPES: {
    ID_LENGTH: 12,
    ID_ALPHABET: "1234567890abcdef",
  },
  INDEXES: {
    OWNER_ID: "games:ownerId:index",
  },
  TRIGGERS: {
    UPDATE_TIMESTAMP: "games:updateTimestamp",
  },
} as const;

export const USERS = {
  TABLE: "users",
  TYPES: {
    NAME_LENGTH: 255,
  },
  TRIGGERS: {
    UPDATE_TIMESTAMP: "users:updateTimestamp",
  },
} as const;

export const FUNCTIONS = {
  UPDATE_TIMESTAMP_COLUMN: "updateTimestampColumn",
} as const;
