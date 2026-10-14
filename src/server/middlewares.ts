import { createMiddleware } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { TRPCError } from "@trpc/server";
import { parse } from "cookie";
import { getExtendedAuthCookie } from "~/server/auth";
import { upsertUser } from "~/server/user";
import type { UserId } from "~/server/validation";
import { userIdSchema } from "~/server/validation";
import { SESSION_ID_HEADER, USER_ID_COOKIE } from "~/utils/auth";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const cookies = parse(request.headers.get("cookie") ?? "");
		const userIdCookie = cookies[USER_ID_COOKIE] as UserId | undefined;
		if (!userIdCookie) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "No user id cookie provided",
			});
		}
		const uuidVerification = userIdSchema.safeParse(userIdCookie);
		if (!uuidVerification.success) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "User id is not of valid type",
			});
		}
		const sessionId = request.headers.get(SESSION_ID_HEADER) || "unknown";
		const user = await upsertUser(
			userIdCookie,
			request.headers.get("user-agent") || "unknown",
		);
		setResponseHeader(...getExtendedAuthCookie(user.id));
		return next({
			context: {
				userId: user.id,
				sessionId,
			},
		});
	},
);
export type AuthContext = (typeof authMiddleware)["_types"]["serverContext"];
