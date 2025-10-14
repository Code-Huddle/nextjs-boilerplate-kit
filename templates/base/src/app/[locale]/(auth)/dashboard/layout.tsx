import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';

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

  // Auth will be provided by the selected auth module
  const session = null; // Placeholder - will be replaced by auth module
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
            <button 
              className="border-none text-gray-700 hover:text-gray-900" 
              type="button"
              onClick={() => {
                // Sign out will be handled by the selected auth module
                console.log('Sign out not configured');
              }}
            >
              {t('sign_out')}
            </button>
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
