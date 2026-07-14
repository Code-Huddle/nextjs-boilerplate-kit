'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/supabase';

type UserData = { id: string; email?: string; role: 'user' | 'admin' };

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    const { user } = await getCurrentUser();
    setUserData(user ? { id: user.id, email: user.email, role: user.role === 'admin' ? 'admin' : 'user' } : null);
    setIsLoading(false);
  };

  useEffect(() => { void refreshUserData(); }, []);

  return {
    userData,
    isLoading,
    refreshUserData,
    isAuthenticated: Boolean(userData),
    role: userData?.role,
    isAdmin: userData?.role === 'admin',
    isUser: userData?.role === 'user',
  };
}
