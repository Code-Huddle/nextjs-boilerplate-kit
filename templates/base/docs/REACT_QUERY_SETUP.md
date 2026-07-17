# TanStack Query setup

The generated Next.js 16 application includes TanStack Query 5 for client-side
queries, mutations, optimistic updates, and server-prefetched hydration.

## Included configuration

`src/libs/queryClient.ts` creates the query client and exports
`QueryClientProvider`, `getQueryClient`, and `makeQueryClient`.

Default query behavior:

- data is fresh for 6 seconds;
- failed queries retry three times with exponential backoff capped at 30
  seconds;
- failed mutations retry once after 1 second;
- queries do not refetch on window focus;
- stale queries refetch after reconnect;
- the server creates a new client per render/request;
- the browser reuses one client so React suspense does not discard query state.

`src/app/[locale]/layout.tsx` already wraps localized application routes with
the provider. Do not add a second provider unless you intentionally need an
isolated cache.

## Client query with optional initial data

`src/components/ExamplePosts.tsx` demonstrates `useQuery` and accepts optional
`initialData`:

```tsx
const query = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  initialData,
});
```

Use this pattern when a server component already has the data and passing it
directly to a nearby client component is simpler than dehydrating a cache.

## Server prefetch and hydration

`src/components/ServerPrefetchedPosts.tsx` creates a server-only client,
prefetches `['posts']`, dehydrates it, and renders the client list inside a
`HydrationBoundary`. Its example fetch uses Next.js revalidation for one hour.

```tsx
const queryClient = makeQueryClient();

await queryClient.prefetchQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <PostsList />
  </HydrationBoundary>
);
```

Use hydration when multiple nested client components should read the same
prefetched cache without threading data through props.

The starter components are examples, not a routed page. Import one into a route
when you want to expose it.

## Shared hooks

`src/hooks/useApi.ts` includes:

- `useApi` for a typed query with `enabled`, `staleTime`, and `initialData`;
- `useApiMutation` for a mutation that invalidates the example `['posts']`
  query after success;
- `useOptimisticMutation` for cancellation, snapshot, optimistic cache update,
  rollback on failure, and final invalidation.

Change the hard-coded `['posts']` invalidation in `useApiMutation` when adapting
that example to another resource.

## Query-key guidance

Use stable, descriptive keys and include every input used by the query:

```ts
['posts']
['posts', { userId }]
['post', postId, 'comments']
```

Avoid vague keys such as `['data']`. Centralize key factories once the
application has enough related queries that spelling or invalidation drift is a
risk.

## Testing

Create a fresh `QueryClient` for each test, disable retries when testing failure
states, and wrap the component in TanStack Query's `QueryClientProvider`.
Mock the network boundary and assert loading, error, success, mutation, and
rollback behavior as appropriate. There is no separate
`@tanstack/react-query-testing` dependency in this project.

## Production considerations

- Choose `staleTime` from the product's freshness requirements, not the starter
  default.
- Ensure server and browser query keys and result shapes match exactly before
  hydrating.
- Avoid putting user-specific server-prefetched data into shared public caches.
- Add user-facing error and retry states for important queries.
- Use TanStack Query Devtools only as an explicit development dependency if the
  team wants them; they are not installed by the generator.

## References

- [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query advanced server rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [Next.js data fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
