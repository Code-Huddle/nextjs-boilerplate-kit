// Stripe feature card component for landing page

interface StripeFeatureCardProps {
  integrationType: 'OneTime' | 'Subscriptions' | 'None';
}

export function StripeFeatureCard({ integrationType }: StripeFeatureCardProps) {
  if (integrationType === 'None') {
    return null;
  }

  const getStripeConfig = () => {
    switch (integrationType) {
      case 'OneTime':
        return {
          title: 'Stripe One-Time Payments',
          description: 'Process single payments and purchases with Stripe\'s secure payment infrastructure.',
          icon: '💳',
          gradient: 'from-green-600 to-green-400',
          testUrl: '/test-payment',
          testLabel: 'Test Payments',
        };
      case 'Subscriptions':
        return {
          title: 'Stripe Subscriptions',
          description: 'Handle recurring billing and subscription management with automated payment processing.',
          icon: '🔄',
          gradient: 'from-blue-600 to-blue-400',
          testUrl: '/test-subscription',
          testLabel: 'Test Subscriptions',
        };
      default:
        return null;
    }
  };

  const config = getStripeConfig();
  if (!config) return null;

  return {
    title: config.title,
    description: config.description,
    icon: config.icon,
    gradient: config.gradient,
    testUrl: config.testUrl,
    testLabel: config.testLabel,
  };
}

export function StripeTechBadge({ integrationType }: StripeFeatureCardProps) {
  if (integrationType === 'None') {
    return null;
  }

  switch (integrationType) {
    case 'OneTime':
      return 'Stripe Payments';
    case 'Subscriptions':
      return 'Stripe Subscriptions';
    default:
      return null;
  }
}

// Enhanced feature card with test link (simplified for template)
export function StripeFeatureCardWithTest({ integrationType }: StripeFeatureCardProps) {
  if (integrationType === 'None') {
    return null;
  }

  const config = StripeFeatureCard({ integrationType });
  if (!config) return null;

  return {
    title: config.title,
    description: config.description,
    icon: config.icon,
    gradient: config.gradient,
    testUrl: config.testUrl,
    testLabel: config.testLabel,
  };
}
