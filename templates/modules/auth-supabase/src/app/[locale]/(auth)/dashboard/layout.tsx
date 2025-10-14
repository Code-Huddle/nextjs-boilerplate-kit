import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link href="/dashboard/" className="border-none text-gray-700 hover:text-gray-900">
              {t('dashboard_link')}
            </Link>
          </li>
          <li>
            <Link href="/dashboard/user-profile/" className="border-none text-gray-700 hover:text-gray-900">
              {t('user_profile_link')}
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <form
              action={async () => {
                'use server';
                await supabase.auth.signOut();
                redirect('/');
              }}
            >
              <button className="border-none text-gray-700 hover:text-gray-900" type="submit">
                {t('sign_out')}
              </button>
            </form>
          </li>
          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      {props.children}
    </BaseTemplate>
  );
}
