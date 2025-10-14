import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="my-6 -ml-16">
      <h1>User Profile</h1>
      <p>
        Path:
        {getI18nPath('/dashboard/user-profile', locale)}
      </p>
      {
        session?.user
          ? (
              <div>
                <p>
                  Name:
                  {session.user.user_metadata?.name || 'Not provided'}
                </p>
                <p>
                  Email:
                  {session.user.email}
                </p>
                <p>
                  User ID:
                  {session.user.id}
                </p>
                {/* Add more user details as needed */}
              </div>
            )
          : (
              <p>Loading user data...</p>
            )
      }

    </div>
  );
}
