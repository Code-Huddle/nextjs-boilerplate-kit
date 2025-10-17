import { UserRole } from '@/types/auth';

export const USER_ROLES: UserRole[] = [
  {
    id: 'user',
    name: 'user',
    displayName: 'User',
    description: 'Standard user with basic access'
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Admin',
    description: 'Administrator with full access'
  }
];

export const getRoleDisplayName = (roleName: UserRole['name']): string => {
  const role = USER_ROLES.find(r => r.name === roleName);
  return role?.displayName || 'User';
};

export const getRoleDescription = (roleName: UserRole['name']): string => {
  const role = USER_ROLES.find(r => r.name === roleName);
  return role?.description || 'Standard user access';
};

export const isAdmin = (role: UserRole['name']): boolean => {
  return role === 'admin';
};
