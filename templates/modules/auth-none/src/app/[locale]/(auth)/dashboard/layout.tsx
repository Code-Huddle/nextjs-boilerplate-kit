import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
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

  // No authentication check - auth is disabled
  const session = null;

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
              disabled
            >
              Sign Out (Disabled)
            </button>
          </li>
          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-800">
          <strong>Authentication is disabled.</strong> This dashboard is accessible without authentication.
        </p>
      </div>
      {props.children}
    </BaseTemplate>
  );
}
