import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/libs/i18nNavigation';
import { UserRoleBadge } from '@/components/UserRoleBadge';

type IPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function UserProfilePage(props: IPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Path:</strong> {getI18nPath('/dashboard/user-profile', locale)}
            </p>
            <p>
              <strong>Role:</strong> <UserRoleBadge role="user" />
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <h3 className="font-medium mb-2">Role-Based Access Control</h3>
          <p className="text-sm text-muted-foreground">
            Your role determines what features and data you can access. 
            Contact your administrator if you need role changes.
          </p>
        </div>
      </div>
    </div>
  );
}
