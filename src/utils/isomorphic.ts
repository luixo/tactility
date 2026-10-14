import { createIsomorphicFn } from "@tanstack/react-start";
import {
	getCookies as getRawCookies,
	getRequest,
} from "@tanstack/react-start/server";
import { pullObject } from "remeda";

export const getCookies = createIsomorphicFn()
	.server(() => getRawCookies())
	.client(async () => {
		const cookies = await cookieStore.getAll();
		return pullObject(
			cookies,
			// oxlint-disable-next-line typescript/no-non-null-assertion
			({ name }) => name!,
			// oxlint-disable-next-line typescript/no-non-null-assertion
			({ value }) => value!,
		);
	});

export const getLanguages = createIsomorphicFn()
	.server(() =>
		(getRequest().headers.get("accept-language") ?? "")
			.split(",")
			.map((lang) => {
				const [tag = "", q = "1"] = lang.trim().split(";q=");
				const [baseTag] = tag.split("-");
				return {
					baseTag: baseTag?.toLowerCase() ?? "",
					fullTag: tag.toLowerCase(),
					q: Number(q),
				};
			})
			.toSorted((a, b) => b.q - a.q)
			.flatMap(({ fullTag, baseTag }) => [fullTag, baseTag]),
	)
	.client(() => window.navigator.languages);

export const getUserAgent = createIsomorphicFn()
	.server(() => {
		const request = getRequest();
		return request.headers.get("user-agent") ?? "unknown";
	})
	.client(() => window.navigator.userAgent);
