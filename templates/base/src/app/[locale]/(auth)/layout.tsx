/* eslint-disable unused-imports/no-unused-vars */
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/libs/i18nNavigation';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Set the request locale for next-intl (i18n)
  setRequestLocale(locale);

  // If you want to keep the logic for signInUrl, signUpUrl, etc. for future use:
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';
  let afterSignOutUrl = '/';

  // Adjust URLs when locale != default, so e.g. "/fr/sign-in"
  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    signUpUrl = `/${locale}${signUpUrl}`;
    dashboardUrl = `/${locale}${dashboardUrl}`;
    afterSignOutUrl = `/${locale}${afterSignOutUrl}`;
  }

  return (
    <>
      {props.children}
    </>
  );
}
