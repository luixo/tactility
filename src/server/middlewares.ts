import { createMiddleware } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { TRPCError } from "@trpc/server";
import { upsertUser } from "~/server/user";
import type { UserId } from "~/server/validation";
import { userIdSchema } from "~/server/validation";
import { SESSION_ID_HEADER, USER_ID_COOKIE } from "~/utils/auth";
import { getCookies } from "~/utils/isomorphic";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const cookies = await getCookies();
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
		setCookie(USER_ID_COOKIE, user.id);
		return next({
			context: {
				sessionId,
				userId: user.id,
			},
		});
	},
);
export type AuthContext = (typeof authMiddleware)["_types"]["serverContext"];
