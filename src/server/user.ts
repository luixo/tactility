import { createServerOnlyFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

import { getDatabase } from "~/db";
import { getSetAuthCookie } from "~/server/auth";
import { getRequest } from "~/server/request";
import type { UserId } from "~/server/validation";
import { YEAR } from "~/utils/time";

const upsertUserCookie = createServerOnlyFn((userId: UserId) =>
  setResponseHeader(
    "set-cookie",
    getSetAuthCookie(userId, new Date(Date.now() + YEAR)),
  ),
);
export const updateUser = async (userId: UserId) => {
  const userAgent = getRequest().headers.get("user-agent") || "unknown";
  await upsertUser(userId, userAgent);
  upsertUserCookie(userId);
};

export const upsertUser = async (userId: UserId, userAgent: string) => {
  const db = getDatabase();
  const user = await db
    .selectFrom("users")
    .where("id", "=", userId)
    .select(["id", "name"])
    .executeTakeFirst();
  if (!user) {
    const newUser = await db
      .insertInto("users")
      .values({
        id: userId,
        userAgent: userAgent.slice(0, 1024),
      })
      .returning(["users.id", "users.name"])
      .executeTakeFirstOrThrow();
    return newUser;
  } else {
    void db
      .updateTable("users")
      .where("users.id", "=", userId)
      .set({ updatedAt: new Date() })
      .executeTakeFirst();
  }
  return user;
};
