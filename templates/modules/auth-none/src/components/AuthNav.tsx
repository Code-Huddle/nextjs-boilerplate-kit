'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function AuthNav() {
  const t = useTranslations('RootLayout');

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
