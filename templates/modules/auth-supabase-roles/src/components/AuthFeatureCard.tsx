interface AuthFeatureCardProps {
  className?: string;
}

export function AuthFeatureCard(_props: AuthFeatureCardProps = {}) {
  return {
    title: 'Authentication',
    description: 'Supabase Auth with role-based routes. New users are "user"; set app_metadata.role to "admin" in the Supabase Dashboard to promote admins.',
    icon: '🔐',
    gradient: 'from-gray-800 to-gray-600',
  };
}
