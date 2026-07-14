interface AuthFeatureCardProps {
  className?: string;
}

export function AuthFeatureCard(_props: AuthFeatureCardProps = {}) {
  return {
    title: 'Authentication',
    description: 'Authentication system is disabled. You can add your preferred authentication solution later.',
    icon: '🔐',
    gradient: 'from-gray-800 to-gray-600',
  };
}
