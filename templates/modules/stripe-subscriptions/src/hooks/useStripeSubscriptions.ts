import { useCallback } from 'react';
import { useApi, useApiMutation } from '@/hooks/useApi';

type Empty = Record<string, never>;
type Subscription = { id: string; status: string; cancelAtPeriodEnd: boolean } | null;
type Price = { id: string; unit_amount: number | null; currency: string; product: { name: string } | null } | null;

async function postStripe<T>(body: object): Promise<T> {
  const response = await fetch('/api/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Stripe request failed');
  return data as T;
}

export function useCreateCheckoutSession() {
  return useApiMutation<{ url: string | null }, { plan: 'monthly' | 'yearly' }>(
    vars => postStripe({ action: 'checkout', plan: vars.plan }),
  );
}

export function useCreatePortalSession() {
  return useApiMutation<{ url: string }, Empty>(() => postStripe({ action: 'portal' }));
}

export function useCancelSubscription() {
  return useApiMutation<{ subscription: Subscription }, Empty>(() => postStripe({ action: 'cancel' }));
}

export function useSubscriptionStatus() {
  const queryFn = useCallback(async () => (await postStripe<{ subscription: Subscription }>({ action: 'status' })).subscription, []);
  return useApi<Subscription>(['stripe', 'subscription'], queryFn, { enabled: true });
}

export function useSubscriptionConfig() {
  const queryFn = useCallback(() => postStripe<{ config: { monthly: Price; yearly: Price } }>({ action: 'config' }).then(data => data.config), []);
  return useApi<{ monthly: Price; yearly: Price }>(['stripe', 'subscription-config'], queryFn, { enabled: true });
}
