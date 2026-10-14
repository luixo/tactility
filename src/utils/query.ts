import { MutationCache, type QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
  mutationCache: new MutationCache({
    onError: (error) => {
      // TODO: replace console output with a toast.
      console.error({
        title: "Ошибка",
        description: error.message,
        color: "danger",
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 0,
      refetchInterval: 30 * 1000,
    },
  },
};
