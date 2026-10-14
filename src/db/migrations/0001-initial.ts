import { sql } from "kysely";
import { COMMON, FUNCTIONS, GAMES, USERS } from "~/db/const";
import type { Database } from "~/db/index";

const createUpdateFunction = async (db: Database) => {
	await sql`
	CREATE OR REPLACE FUNCTION ${sql.raw(FUNCTIONS.UPDATE_TIMESTAMP_COLUMN)} ()
		RETURNS TRIGGER
		AS $$
			BEGIN
				NEW.${sql.id(COMMON.updatedAtColumn)} = ${COMMON.nowTimestamp};
				RETURN NEW;
			END;
		$$
	LANGUAGE 'plpgsql';
	`.execute(db);
};

const removeUpdateFunction = async (db: Database) => {
	await sql`DROP FUNCTION ${sql.raw(FUNCTIONS.UPDATE_TIMESTAMP_COLUMN)}();`.execute(
		db,
	);
};

const createUserTable = async (db: Database) => {
	await db.schema
		.createTable(USERS.TABLE)
		.ifNotExists()
		.addColumn("id", "uuid", (cb) => cb.primaryKey().notNull())
		.addColumn("name", `varchar(${USERS.TYPES.NAME_LENGTH})`)
		.addColumn("userAgent", "varchar(1024)", (cb) =>
			cb.notNull().defaultTo("unknown"),
		)
		.addColumn(COMMON.createdAtColumn, "timestamptz", (cb) =>
			cb.notNull().defaultTo(COMMON.nowTimestamp),
		)
		.addColumn(COMMON.updatedAtColumn, "timestamptz", (cb) =>
			cb.notNull().defaultTo(COMMON.nowTimestamp),
		)
		.execute();
	await sql`
  CREATE TRIGGER ${sql.id(USERS.TRIGGERS.UPDATE_TIMESTAMP)}
    BEFORE UPDATE ON ${sql.table(USERS.TABLE)}
    FOR EACH ROW
    EXECUTE PROCEDURE ${sql.raw(FUNCTIONS.UPDATE_TIMESTAMP_COLUMN)} ();
  `.execute(db);
};

const removeUserTable = async (db: Database) => {
	await sql`
	DROP TRIGGER ${sql.id(USERS.TRIGGERS.UPDATE_TIMESTAMP)} ON ${sql.table(USERS.TABLE)};`.execute(
		db,
	);
	await db.schema.dropTable(USERS.TABLE).ifExists().execute();
};

const GAME_ID_TYPE = `varchar(${GAMES.TYPES.ID_LENGTH})` as const;

const createGamesTable = async (db: Database) => {
	await db.schema
		.createTable(GAMES.TABLE)
		.ifNotExists()
		.addColumn("id", GAME_ID_TYPE, (cb) => cb.primaryKey().notNull())
		.addColumn("ownerId", "uuid", (cb) =>
			cb
				.notNull()
				.references(`${USERS.TABLE}.id`)
				.onUpdate("cascade")
				.onDelete("cascade"),
		)
		.addColumn("state", "jsonb", (cb) => cb.notNull())
		.addColumn(COMMON.createdAtColumn, "timestamptz", (cb) =>
			cb.notNull().defaultTo(COMMON.nowTimestamp),
		)
		.addColumn(COMMON.updatedAtColumn, "timestamptz", (cb) =>
			cb.notNull().defaultTo(COMMON.nowTimestamp),
		)
		.execute();
	await db.schema
		.createIndex(GAMES.INDEXES.OWNER_ID)
		.on(GAMES.TABLE)
		.column("ownerId")
		.execute();
	await sql`
  CREATE TRIGGER ${sql.id(GAMES.TRIGGERS.UPDATE_TIMESTAMP)}
    BEFORE UPDATE ON ${sql.table(GAMES.TABLE)}
    FOR EACH ROW
    EXECUTE PROCEDURE ${sql.raw(FUNCTIONS.UPDATE_TIMESTAMP_COLUMN)} ();
  `.execute(db);
};

const removeGamesTable = async (db: Database) => {
	await sql`
	DROP TRIGGER ${sql.id(GAMES.TRIGGERS.UPDATE_TIMESTAMP)} ON ${sql.table(GAMES.TABLE)};`.execute(
		db,
	);
	await db.schema.dropIndex(GAMES.INDEXES.OWNER_ID).execute();
	await db.schema.dropTable(GAMES.TABLE).ifExists().execute();
};

export const up = async (db: Database) => {
	await createUpdateFunction(db);

	await createUserTable(db);
	await createGamesTable(db);
};

export const down = async (db: Database) => {
	await removeGamesTable(db);
	await removeUserTable(db);

	await removeUpdateFunction(db);
};
