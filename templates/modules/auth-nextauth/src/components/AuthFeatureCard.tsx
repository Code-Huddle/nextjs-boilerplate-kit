interface AuthFeatureCardProps {
  className?: string;
}

export function AuthFeatureCard(_props: AuthFeatureCardProps = {}) {
  return {
    title: 'Authentication',
    description: 'Complete authentication system with NextAuth.js including social login and user management.',
    icon: '🔐',
    gradient: 'from-gray-800 to-gray-600',
  };
}
