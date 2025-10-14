'use client';

import { useQuery } from '@tanstack/react-query';

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

type PostsListProps = {
  initialData?: Post[];
};

export function PostsList({ initialData }: PostsListProps) {
  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialData,
  });

  if (isLoading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error:
        {' '}
        {error.message}
        <button
          type="button"
          onClick={() => refetch()}
          className="ml-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Posts</h2>
      <div className="space-y-4">
        {posts?.slice(0, 5).map(post => (
          <div key={post.id} className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="mt-2 text-gray-600">{post.body}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => refetch()}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Refresh Posts
      </button>
    </div>
  );
}
