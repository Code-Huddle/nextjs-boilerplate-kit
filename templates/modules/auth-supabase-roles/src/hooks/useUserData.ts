'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/cookies';

interface UserData {
  role: string;
  id: string;
  email: string;
  name?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setIsLoading(false);
  }, []);

  const refreshUserData = () => {
    const data = getUserData();
    setUserData(data);
  };

  return {
    userData,
    isLoading,
    refreshUserData,
    isAuthenticated: !!userData,
    role: userData?.role,
    isAdmin: userData?.role === 'admin',
    isUser: userData?.role === 'user',
  };
}
