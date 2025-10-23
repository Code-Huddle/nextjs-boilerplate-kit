import { useApi, useApiMutation } from '@/hooks/useApi';

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
  return useApiMutation<User, NewUser>(async (userData) => {
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
  return useApiMutation<User, { id: string; data: Partial<NewUser> }>(async ({ id, data }) => {
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
  return useApiMutation<void, string>(async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  });
}
