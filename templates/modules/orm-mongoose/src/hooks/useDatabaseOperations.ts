import { useApi, useApiMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewUser {
  name: string;
  email: string;
}

// Users hooks
export function useUsers() {
  return useApi<User[]>(['users'], async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useApiMutation<User, NewUser>(async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  }, {
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useApiMutation<User, { id: string; data: Partial<NewUser> }>(async ({ id, data }) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  }, {
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  }, {
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
