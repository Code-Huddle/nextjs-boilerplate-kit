'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function AuthNav() {
  const t = useTranslations('RootLayout');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

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
    return (
      <>
        <span className="hidden max-w-[12rem] truncate text-sm text-muted-foreground sm:inline">
          {user.user_metadata?.full_name || user.email}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await supabase.auth.signOut();
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
