interface AuthFeatureCardProps {
  className?: string;
}

export function AuthFeatureCard({ className }: AuthFeatureCardProps = {}) {
  return {
    title: 'Authentication',
    description: 'Complete authentication system with Supabase Auth including social login, user management, and real-time features.',
    icon: '🔐',
    gradient: 'from-gray-800 to-gray-600',
  };
}
