import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://honest-dog-dev-104c88de45c2.herokuapp.com/api';
// These interfaces are put in to another next-auth.s.ts file inside the types folder.
// declare module 'next-auth' {
//   type Session = {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       role?: string;
//     };
//     accessToken?: string;
//     error?: string;
//   };
//   type User = {
//     role?: string;
//     accessToken?: string;
//     refreshToken?: string;
//     accessTokenExpires?: number;
//   };
// }

// declare module 'next-auth/jwt' {
//   type JWT = {
//     accessToken?: string;
//     refreshToken?: string;
//     accessTokenExpires?: number;
//     user?: {
//       id: string;
//       email: string;
//       name: string;
//       role?: string;
//     };
//     error?: string;
//   };
// }

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${API_URL}/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();
          // console.log(data);

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          return {
            id: data.user.userId.toString(),
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: data.user.role,
            accessToken: data.tokens.access_token,
            refreshToken: data.tokens.refresh_token,
            accessTokenExpires: Date.now() + data.tokens.access_token_expires_in * 1000,
          };
        } catch (error) {
          console.error('Credentials authentication error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
        token.accessToken = account.provider === 'credentials' ? user.accessToken : account.access_token;

        // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider

        token.refreshToken = user.refreshToken;
        // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
        token.accessTokenExpires = user.accessTokenExpires;
        token.user = {
          id: user.id ?? '',
          email: user.email ?? '',
          name: user.name ?? '',
          // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
          role: user.role || 'user',
        };
      }

      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // console.log("Checking the expiry")

      return token.refreshToken ? await refreshAccessToken(token) : token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      token.accessTokenExpires = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days ago

      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        /* console.log('Token is valid, no need to refresh.'); */
        // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
        session.accessToken = token.accessToken;
        // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
        session.error = undefined;
        return session;
      } else {
        /* The console statements here are just to console the tokens and to see whether the refresh is working or not */
        // console.log("Token is expired")
        const response = await refreshAccessToken(token);
        token.accessToken = response.accessToken;
        // console.log("The Refresh Token Response", response)
      }
      // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
      session.accessToken = token.accessToken;
      // @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider
      session.error = token.error;
      return session;
    },

  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 24 * 60 * 60, // 15 days
  },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.refreshToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.access_token_expires_in * 1000,

      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
