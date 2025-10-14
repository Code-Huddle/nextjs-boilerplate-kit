import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  type Session = {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
    };
    accessToken?: string;
    error?: string;
  };

  type User = {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  };
}

declare module 'next-auth/jwt' {
  type JWT = {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      id: string;
      email: string;
      name: string;
      role?: string;
    };
    error?: string;
  } & DefaultJWT;
}


