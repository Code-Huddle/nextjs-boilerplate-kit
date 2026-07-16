import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: {
          // Re-prompt after logout so users can pick a different GitHub account
          prompt: 'consent',
        },
      },
    }),
    Google({
      authorization: {
        params: {
          // Always show the account chooser instead of silently reusing the last account
          prompt: 'select_account',
        },
      },
    }),
  ],
  pages: { signIn: '/sign-in' },
  session: { strategy: 'jwt' },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
