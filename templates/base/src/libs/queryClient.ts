'use client';

import type { DehydratedState } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
  HydrationBoundary,
  isServer,
  QueryClient,
  QueryClientProvider as RQProvider,
} from '@tanstack/react-query';
import { createElement } from 'react';

type Props = {
  children: ReactNode;
  dehydratedState?: unknown;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 6 * 1000, // 6 seconds
        // Retry failed requests 3 times
        retry: 3,
        // Retry delay with exponential backoff
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus only if data is stale
        refetchOnWindowFocus: false,
        // Refetch on reconnect only if data is stale
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export function QueryClientProvider({ children, dehydratedState }: Props) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  const content = dehydratedState
    ? createElement(HydrationBoundary, { state: dehydratedState as DehydratedState, children })
    : children;

  return createElement(RQProvider, { client: queryClient, children: content });
}

export type { QueryClient } from '@tanstack/react-query';
export { getQueryClient, makeQueryClient };
