'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCheckoutSession, useSubscriptionConfig } from '@/hooks/useStripeSubscriptions';
import { StripeSubscriptionManager } from './StripeSubscriptionManager';

export function SubscriptionDemo() {
  const config = useSubscriptionConfig();
  const checkout = useCreateCheckoutSession();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {(['monthly', 'yearly'] as const).map((plan) => {
          const price = config.data?.[plan];
          return (
            <Card key={plan}>
              <CardHeader>
                <CardTitle className="capitalize">{plan}</CardTitle>
                <CardDescription>{price?.product?.name ?? 'Configure this plan in Stripe'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-2xl font-bold">
                  {price?.unit_amount == null ? '—' : new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(price.unit_amount / 100)}
                </p>
                <Button className="w-full" disabled={!price || checkout.isPending} onClick={async () => {
                  const result = await checkout.mutateAsync({ plan });
                  if (result.url) window.location.assign(result.url);
                }}>Subscribe</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <StripeSubscriptionManager />
    </div>
  );
}
