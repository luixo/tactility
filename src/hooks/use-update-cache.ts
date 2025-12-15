import type React from "react";

import type { QueryClient, queryOptions } from "@tanstack/react-query";

import { updateSetStateAction } from "~/utils/react";

export const updateCache =
  <Output, Error, QueryKey extends unknown[]>(
    queryClient: QueryClient,
    queryFilters: ReturnType<
      typeof queryOptions<Output, Error, Output, QueryKey>
    >,
  ) =>
  (setStateAction: React.SetStateAction<Output>) => {
    let savedPrevValue: Output | undefined;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryClient.setQueryData<Output>(queryFilters.queryKey!, (prevOutput) => {
      if (prevOutput === undefined) {
        return;
      }
      savedPrevValue = prevOutput;
      return updateSetStateAction(prevOutput, setStateAction);
    });
    return savedPrevValue;
  };
