import { MutationCache } from "@tanstack/react-query";
import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			refetchInterval: 30 * 1000,
			retry: 0,
			staleTime: 30 * 1000,
		},
	},
	mutationCache: new MutationCache({
		onError: (error) => {
			// TODO: replace console output with a toast.
			console.error({
				color: "danger",
				description: error.message,
				title: "Ошибка",
			});
		},
	}),
};
