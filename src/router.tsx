import { Spinner } from "@heroui/react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import { checkConnectivity } from "~/db";
import { updateUser } from "~/server/user";
import { createI18nContext } from "~/utils/i18n";
import { getCookies } from "~/utils/isomorphic";
import { queryClientConfig } from "~/utils/query";
import { getUserId } from "~/utils/user";
import { routeTree } from "./routeTree.gen";
import { getLanguage } from "./utils/i18n-internal";

export const getRouter = async () => {
	const userId = getUserId(await getCookies());
	if (import.meta.env.SSR) {
		await checkConnectivity();
		await updateUser(userId);
	}
	const queryClient = new QueryClient(queryClientConfig);
	const i18n = createI18nContext(await getLanguage());
	const router = createTanStackRouter({
		Wrap: ({ children }) => <i18n.Provider>{children}</i18n.Provider>,
		context: {
			i18n,
			queryClient,
			userId,
		},
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: NotFound,
		defaultPendingComponent: Spinner,
		dehydrate: () => ({
			i18n: i18n.serializeContext(),
		}),
		hydrate: async (dehydratedData) => {
			await i18n.onHydrate(dehydratedData.i18n);
		},
		routeTree,
	});
	setupRouterSsrQueryIntegration({ queryClient, router });
	return router;
};

declare module "@tanstack/react-router" {
	// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: Awaited<ReturnType<typeof getRouter>>;
	}
}
