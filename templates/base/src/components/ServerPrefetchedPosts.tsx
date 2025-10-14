import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { makeQueryClient } from '@/libs/queryClient';
import { PostsList } from './ExamplePosts';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

export default async function ServerPrefetchedPosts() {
  const queryClient = makeQueryClient();

  // Prefetch the posts data on the server
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsList />
    </HydrationBoundary>
  );
}
