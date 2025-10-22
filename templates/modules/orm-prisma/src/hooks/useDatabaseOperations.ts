import { useApi, useApiMutation } from '@/hooks/useApi';
import type { User } from '@prisma/client';

// Users hooks
export function useUsers() {
  return useApi<User[]>(['users'], async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  });
}

export function useCreateUser() {
  return useApiMutation<User, { name: string; email: string }>(async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  });
}

export function useUpdateUser() {
  return useApiMutation<User, { id: number; data: { name?: string; email?: string } }>(async ({ id, data }) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  });
}

export function useDeleteUser() {
  return useApiMutation<void, number>(async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  });
}
