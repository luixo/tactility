/// <reference types="vite/client" />

import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { z } from "zod";
import { Devtools } from "~/components/devtools";
import { Header } from "~/components/header";
import { SessionWrapper } from "~/components/session-wrapper";
import { userQueryOptions } from "~/server/handlers/users";
import type { UserId } from "~/server/validation";
import appCss from "~/styles/app.css?url";
import type { createI18nContext } from "~/utils/i18n";

const RootComponent = () => {
	const { user: initialUser } = Route.useLoaderData();
	return (
		<SessionWrapper initialUser={initialUser}>
			{({ userId }) => (
				<div className="flex flex-col gap-4">
					<Header />
					<Outlet key={userId} />
					<Devtools />
				</div>
			)}
		</SessionWrapper>
	);
};

export type RouterContext = {
	userId: UserId;
	queryClient: QueryClient;
	i18n: ReturnType<typeof createI18nContext>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	validateSearch: z.object({
		debug: z.coerce.boolean().optional().catch(false),
	}),
	loader: async ({ context }) => {
		await context.i18n.loadNamespace("default");
		const user = await context.queryClient.ensureQueryData(userQueryOptions);
		return {
			user: user || { name: "never-happen", id: "never-happen" as UserId },
			title: context.i18n.getTranslation()("common.title"),
		};
	},
	component: RootComponent,
	head: ({ loaderData }) => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: loaderData?.title ?? "Tactility" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	shellComponent: ({ children }) => (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body className="mx-auto max-w-2xl p-4">
				<main>{children}</main>
				<Scripts />
			</body>
		</html>
	),
});
