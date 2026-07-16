'use client';

import Link from 'next/link';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

function AuthNavContent() {
  const t = useTranslations('RootLayout');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-muted" aria-hidden />;
  }

  if (session?.user) {
    return (
      <>
        <span className="hidden max-w-[12rem] truncate text-sm text-muted-foreground sm:inline">
          {session.user.name || session.user.email}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => signOut({ redirectTo: '/' })}
        >
          {t('sign_out_link')}
        </Button>
      </>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-foreground"
      >
        {t('sign_in_link')}
      </Link>
      <Button asChild variant="futuristic" size="sm">
        <Link href="/sign-up">{t('sign_up_link')}</Link>
      </Button>
    </>
  );
}

export function AuthNav() {
  return (
    <SessionProvider>
      <AuthNavContent />
    </SessionProvider>
  );
}
