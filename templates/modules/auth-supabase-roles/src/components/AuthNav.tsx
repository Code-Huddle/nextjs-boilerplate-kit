'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { signOut, supabase } from '@/lib/supabase';

export function AuthNav() {
  const t = useTranslations('RootLayout');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-muted" aria-hidden />;
  }

  if (user) {
    const role = user.app_metadata?.role === 'admin' ? 'admin' : 'user';
    return (
      <>
        <Link
          href={role === 'admin' ? '/admin' : '/user'}
          className="text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-foreground"
        >
          {user.email}
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
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
