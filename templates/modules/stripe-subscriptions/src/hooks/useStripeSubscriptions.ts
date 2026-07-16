import { useCallback, useEffect, useState } from 'react';
import { useApi, useApiMutation } from '@/hooks/useApi';

type Empty = Record<string, never>;
type Subscription = { id: string; status: string; cancelAtPeriodEnd: boolean } | null;
type Price = { id: string; unit_amount: number | null; currency: string; product: { name: string } | null } | null;
const STRIPE_SUBSCRIPTION_SESSION_STORAGE_KEY = 'stripe-subscription-session-id';

function readStoredStripeSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(STRIPE_SUBSCRIPTION_SESSION_STORAGE_KEY);
}

export function storeStripeSubscriptionSessionId(sessionId: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STRIPE_SUBSCRIPTION_SESSION_STORAGE_KEY, sessionId);
  }
}

export function useStoredStripeSubscriptionSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(readStoredStripeSessionId());
  }, []);

  return sessionId;
}

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
  const sessionId = useStoredStripeSubscriptionSessionId();
  return useApiMutation<{ url: string }, Empty>(() => postStripe({ action: 'portal', sessionId }));
}

export function useCancelSubscription() {
  const sessionId = useStoredStripeSubscriptionSessionId();
  return useApiMutation<{ subscription: Subscription }, Empty>(() => postStripe({ action: 'cancel', sessionId }));
}

export function useSubscriptionStatus() {
  const sessionId = useStoredStripeSubscriptionSessionId();
  const queryFn = useCallback(async () => {
    return (await postStripe<{ subscription: Subscription }>({ action: 'status', sessionId })).subscription;
  }, [sessionId]);
  return useApi<Subscription>(['stripe', 'subscription', sessionId], queryFn, { enabled: Boolean(sessionId) });
}

export function useSubscriptionConfig() {
  const queryFn = useCallback(() => postStripe<{ config: { monthly: Price; yearly: Price } }>({ action: 'config' }).then(data => data.config), []);
  return useApi<{ monthly: Price; yearly: Price }>(['stripe', 'subscription-config'], queryFn, { enabled: true });
}
