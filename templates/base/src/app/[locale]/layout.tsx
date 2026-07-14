import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18nNavigation';
import { QueryClientProvider } from '@/libs/queryClient';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  dehydratedState?: unknown;
}>) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Using internationalization in Client Components
  const messages = await getMessages();

  return (
    <QueryClientProvider dehydratedState={props.dehydratedState}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div lang={locale}>{props.children}</div>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
