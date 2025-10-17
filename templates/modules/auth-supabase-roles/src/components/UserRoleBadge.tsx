'use client';

import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/lib/roles';
import { User } from '@/types/auth';

interface UserRoleBadgeProps {
  role: User['role'];
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const getVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'user':
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant(role)} className={className}>
      {getRoleDisplayName(role)}
    </Badge>
  );
}
