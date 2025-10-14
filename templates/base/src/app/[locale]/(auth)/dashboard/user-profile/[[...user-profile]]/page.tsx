import { auth } from 'auth';
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
  const session = await auth();

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
                  {session.user.name}
                </p>
                <p>
                  Email:
                  {session.user.email}
                </p>
                <p>
                  User Role:
                  {/* @ts-expect-error: TypeScript might not recognize the custom 'accessToken' property on the 'user' object from the credentials provider */}
                  {session.user.role}
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
