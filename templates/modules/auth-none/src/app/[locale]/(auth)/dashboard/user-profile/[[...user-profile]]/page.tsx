import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

type IUserProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IUserProfilePageProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function UserProfilePage(props: IUserProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="my-6 -ml-16">
      <h1>User Profile</h1>
      <p>
        Path:
        {getI18nPath('/dashboard/user-profile', locale)}
      </p>
      <div className="p-4 bg-gray-100 border border-gray-300 rounded">
        <p className="text-gray-700">
          <strong>Authentication is disabled.</strong> No user session available.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          To enable user profiles, re-run the project creation command and select NextAuth or Supabase.
        </p>
      </div>
    </div>
  );
}
