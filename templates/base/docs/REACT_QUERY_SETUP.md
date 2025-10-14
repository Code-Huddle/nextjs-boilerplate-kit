# React Query Setup Guide for Next.js 15

This guide covers the proper setup and configuration of TanStack Query (React Query) with Next.js 15, following the latest best practices.

## Overview

Our React Query setup follows the recommended patterns from the official documentation, optimized for Next.js 15 with App Router and Server Components.

## Configuration

### 1. QueryClient Setup

The QueryClient is configured with optimal settings for SSR and performance:

- **staleTime**: 6 seconds - prevents unnecessary refetches
- **retry**: 3 attempts with exponential backoff
- **refetchOnWindowFocus**: false - only refetch if data is stale
- **refetchOnReconnect**: true - refetch on network reconnect

### 2. Server/Client Handling

The setup properly handles both server and client environments:

- **Server**: Creates a new QueryClient for each request
- **Client**: Reuses the same QueryClient to prevent recreation during React suspense

## Usage Patterns

### Pattern 1: Initial Data Technique

Use this when you want to pass server-fetched data directly to client components.

**Pros:**
- Simple to implement
- No hydration complexity
- Good for simple use cases

**Cons:**
- Passing data down component tree can be cumbersome
- Not ideal for deeply nested queries

### Pattern 2: Hydration Technique (Recommended)

Use this for optimal performance and better developer experience.

**Pros:**
- Better performance with server-side prefetching
- Automatic hydration
- Works well with nested components
- Follows React Query best practices

**Cons:**
- Slightly more complex setup
- Requires understanding of hydration

## Best Practices

### 1. Query Keys

Use consistent and descriptive query keys:

**Good examples:**
- `['posts']`
- `['posts', { userId: 123 }]`
- `['posts', 'comments', { postId: 456 }]`

**Avoid:**
- `['data']`
- `['posts', 'stuff']`

### 2. Error Handling

Always handle errors gracefully with proper retry mechanisms and user feedback.

### 3. Loading States

Provide meaningful loading states to improve user experience.

### 4. Stale Time Configuration

Configure appropriate stale times based on your data:

- **Frequently changing data**: `staleTime: 0`
- **Semi-static data**: `staleTime: 5 * 60 * 1000` (5 minutes)
- **Static data**: `staleTime: Infinity`

### 5. Server-Side Fetching

Use Next.js fetch with revalidation for optimal performance.

## Example Implementation

See the complete examples in:
- `src/components/ExamplePosts.tsx` - Client component with initialData support
- `src/components/ServerPrefetchedPosts.tsx` - Server component with prefetching
- `src/app/[locale]/react-query-example/page.tsx` - Complete page demonstrating both patterns

## Testing

When testing React Query components:

1. Wrap components in `QueryClientProvider`
2. Use `@tanstack/react-query-testing` for testing utilities
3. Mock API responses appropriately
4. Test loading, error, and success states

## Performance Considerations

1. **Stale Time**: Set appropriate stale times to balance freshness and performance
2. **Prefetching**: Use server-side prefetching for critical data
3. **Query Deduplication**: React Query automatically deduplicates identical queries
4. **Background Updates**: Enable background refetching for better UX

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure server and client render the same content
2. **Query Client Recreation**: Use the provided `getQueryClient()` function
3. **Stale Data**: Adjust stale time and refetch intervals
4. **Memory Leaks**: Properly clean up queries when components unmount

### Debug Mode

Enable React Query DevTools in development for better debugging experience.

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query with Next.js Guide](https://faun.pub/from-setup-to-execution-the-most-accurate-tanstack-query-and-next-js-14-integration-guide-8e5aff6ee8ba)

## Migration from v4

If migrating from React Query v4:

1. Update imports from `react-query` to `@tanstack/react-query`
2. Replace `useQueryClient` with `useQueryClient` (same API)
3. Update any deprecated options
4. Test thoroughly, especially SSR functionality
