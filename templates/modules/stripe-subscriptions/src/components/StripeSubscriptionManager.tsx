'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useCancelSubscription,
  useCreatePortalSession,
  useStoredStripeSubscriptionSessionId,
  useSubscriptionStatus,
} from '@/hooks/useStripeSubscriptions';

export function StripeSubscriptionManager() {
  const sessionId = useStoredStripeSubscriptionSessionId();
  const status = useSubscriptionStatus();
  const portal = useCreatePortalSession();
  const cancel = useCancelSubscription();
  const subscription = status.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          {subscription
            ? `Status: ${subscription.status}`
            : sessionId
              ? 'No subscription was found for the latest completed checkout session.'
              : 'Complete checkout first to manage the latest demo subscription from this browser.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" variant="outline" disabled={!sessionId || portal.isPending} onClick={async () => {
          const result = await portal.mutateAsync({});
          window.location.assign(result.url);
        }}>Manage billing</Button>
        {subscription && !subscription.cancelAtPeriodEnd && (
          <Button className="w-full" variant="destructive" disabled={cancel.isPending} onClick={async () => {
            await cancel.mutateAsync({});
            await status.refetch();
          }}>Cancel at period end</Button>
        )}
      </CardContent>
    </Card>
  );
}
