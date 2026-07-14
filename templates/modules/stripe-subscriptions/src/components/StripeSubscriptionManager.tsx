'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCancelSubscription, useCreatePortalSession, useSubscriptionStatus } from '@/hooks/useStripeSubscriptions';

export function StripeSubscriptionManager() {
  const status = useSubscriptionStatus();
  const portal = useCreatePortalSession();
  const cancel = useCancelSubscription();
  const subscription = status.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>{subscription ? `Status: ${subscription.status}` : 'No subscription found for the signed-in user.'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" variant="outline" onClick={async () => {
          const result = await portal.mutateAsync({});
          window.location.assign(result.url);
        }}>Manage billing</Button>
        {subscription && !subscription.cancelAtPeriodEnd && (
          <Button className="w-full" variant="destructive" onClick={async () => {
            await cancel.mutateAsync({});
            await status.refetch();
          }}>Cancel at period end</Button>
        )}
      </CardContent>
    </Card>
  );
}
