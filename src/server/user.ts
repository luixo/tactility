import { setCookie } from "@tanstack/react-start/server";
import { getDatabase } from "~/db";
import type { UserId } from "~/server/validation";
import { USER_ID_COOKIE } from "~/utils/auth";
import { getUserAgent } from "~/utils/isomorphic";

export const upsertUser = async (userId: UserId, userAgent: string) => {
	const db = getDatabase();
	const user = await db
		.selectFrom("users")
		.where("id", "=", userId)
		.select(["id", "name"])
		.executeTakeFirst();
	if (user) {
		void db
			.updateTable("users")
			.where("users.id", "=", userId)
			.set({ updatedAt: new Date() })
			.executeTakeFirst();
	} else {
		const newUser = await db
			.insertInto("users")
			.values({
				id: userId,
				userAgent: userAgent.slice(0, 1024),
			})
			.returning(["users.id", "users.name"])
			.executeTakeFirstOrThrow();
		return newUser;
	}
	return user;
};

export const updateUser = async (userId: UserId) => {
	const userAgent = getUserAgent();
	await upsertUser(userId, userAgent);
	setCookie(USER_ID_COOKIE, userId);
};
