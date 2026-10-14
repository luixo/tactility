import { createIsomorphicFn } from "@tanstack/react-start";
import type { Cookies } from "cookie";
import type { UserId } from "~/server/validation";
import { USER_ID_COOKIE } from "~/utils/auth";

export const getUserId = createIsomorphicFn()
	.server(
		async (cookies: Cookies) =>
			(cookies[USER_ID_COOKIE] || crypto.randomUUID()) as UserId,
	)
	.client((cookies: Cookies) => {
		if (!cookies[USER_ID_COOKIE]) {
			throw new Error("Client should always have user cookie!");
		}
		return cookies[USER_ID_COOKIE] as UserId;
	});
