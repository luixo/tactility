import { createServerOnlyFn } from "@tanstack/react-start";
import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool, type PoolConfig } from "pg";

import type { DB } from "~/db/database.gen";

const getDatabaseConfig = (): PoolConfig => {
  if (!process.env["DATABASE_URL"]) {
    throw new Error("Expected to have process.env.DATABASE_URL variable!");
  }
  return {
    connectionString: process.env["DATABASE_URL"],
  };
};

const databaseConfig = getDatabaseConfig();
const dialect = new PostgresDialect({
  pool: new Pool(databaseConfig),
});
export type Database = Kysely<DB>;
export const getDatabase = createServerOnlyFn(
  () => new Kysely<DB>({ dialect }),
);
export const checkConnectivity = createServerOnlyFn(async () => {
  const db = getDatabase();
  try {
    await db.executeQuery(sql`select 1`.compile(db));
  } catch {
    throw new Error(
      `No connection with PostgreSQL database\nCheck connection string "${getDatabaseConfig().connectionString}" is correct.`,
    );
  }
});
