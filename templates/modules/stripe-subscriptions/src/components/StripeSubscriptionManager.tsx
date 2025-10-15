'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSubscriptionStatus, useCreatePortalSession, useCancelSubscription } from '@/hooks/useStripeSubscriptions';

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      price: {
        id: string;
        nickname?: string;
        unit_amount?: number;
        currency: string;
        recurring: {
          interval: string;
        };
      };
    }>;
  };
}

interface StripeSubscriptionManagerProps {
  customerId?: string;
  onSubscriptionChange?: (subscription: Subscription | null) => void;
}

export function StripeSubscriptionManager({ 
  customerId, 
  onSubscriptionChange 
}: StripeSubscriptionManagerProps) {
  const { data: subscription, isLoading, error, refetch } = useSubscriptionStatus(customerId);
  const portalMutation = useCreatePortalSession();
  const cancelMutation = useCancelSubscription({ onSuccess: () => { refetch(); } });

  const handleManageSubscription = async () => {
    if (!customerId) return;
    const res = await portalMutation.mutateAsync({ customerId });
    if (res.url) window.location.href = res.url;
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    await cancelMutation.mutateAsync({ subscriptionId: subscription.id });
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="destructive">Canceling</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">Unpaid</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (isLoading && !subscription) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center">Loading subscription...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive mb-4">{String(error)}</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a subscription using the test plans above to see subscription management features.
            </p>
            <Button 
              onClick={() => window.location.href = '/test-subscription'} 
              variant="futuristic" 
              className="w-full"
            >
              Go to Test Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = subscription.items.data[0]?.price;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Subscription
          {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPrice && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {currentPrice.nickname || 'Subscription Plan'}
              </span>
              <span className="text-lg font-bold">
                {currentPrice.unit_amount && formatPrice(currentPrice.unit_amount, currentPrice.currency)}
                <span className="text-sm text-muted-foreground">
                  /{currentPrice.recurring.interval}
                </span>
              </span>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current period ends:</span>
            <span>{formatDate(subscription.current_period_end)}</span>
          </div>
          {subscription.cancel_at_period_end && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cancels on:</span>
              <span className="text-destructive">{formatDate(subscription.current_period_end)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Manage Billing'}
          </Button>

          {subscription.status === 'active' && !subscription.cancel_at_period_end && (
            <Button
              onClick={handleCancelSubscription}
              disabled={isLoading}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {isLoading ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
