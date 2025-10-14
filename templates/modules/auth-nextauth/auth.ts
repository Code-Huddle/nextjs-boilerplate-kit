import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://honest-dog-dev-104c88de45c2.herokuapp.com/api';

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
        token.accessToken = account.provider === 'credentials' ? user.accessToken : account.access_token;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.user = {
          id: user.id ?? '',
          email: user.email ?? '',
          name: user.name ?? '',
          role: user.role || 'user',
        };
      }

      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

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
        session.accessToken = token.accessToken;
        session.error = undefined;
        return session;
      } else {
        const response = await refreshAccessToken(token);
        token.accessToken = response.accessToken;
      }
      session.accessToken = token.accessToken;
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
