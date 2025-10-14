import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Generic API hook for common operations
export function useApi<TData>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    initialData?: TData;
  },
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
    initialData: options?.initialData,
  });
}

// Generic mutation hook
export function useApiMutation<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

// Hook for optimistic updates
export function useOptimisticMutation<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    queryKey: string[];
    updateFn: (oldData: TData | undefined, variables: TVariables) => TData;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: options.queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(options.queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(options.queryKey, (old: TData | undefined) =>
        options.updateFn(old, variables));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err: TError, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(options.queryKey, context.previousData);
      }
      options.onError?.(err, variables);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: options.queryKey });
    },
    onSuccess: options.onSuccess,
  });
}
