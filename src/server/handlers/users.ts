import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getDatabase } from "~/db";
import { authMiddleware } from "~/server/middlewares";

export const getUser = createServerFn()
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const db = getDatabase();
		const user = await db
			.selectFrom("users")
			.select(["users.id", "users.name"])
			.where("users.id", "=", context.userId)
			.executeTakeFirst();
		if (!user) {
			throw notFound();
		}
		return user;
	});

export const userQueryOptions = queryOptions({
	queryKey: ["user"],
	queryFn: ({ signal }) => getUser({ signal }),
});
