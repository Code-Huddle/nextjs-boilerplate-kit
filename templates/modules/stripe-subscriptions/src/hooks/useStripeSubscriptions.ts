import { useCallback } from 'react';
import { useApi, useApiMutation } from '@/hooks/useApi';

type CreateCustomerVars = { email: string; name?: string };
type CreateCustomerRes = { customerId: string; email: string };

type CheckoutSessionVars = { priceId: string; customerId: string; successUrl?: string; cancelUrl?: string };
type CheckoutSessionRes = { sessionId?: string; url?: string; error?: string };

type PortalSessionVars = { customerId: string; returnUrl?: string };
type PortalSessionRes = { url?: string; error?: string };

type CancelSubscriptionVars = { subscriptionId: string };
type CancelSubscriptionRes = { subscriptionId: string; status: string; cancelAtPeriodEnd: boolean };

type SubscriptionItem = {
  price: {
    id: string;
    nickname?: string;
    unit_amount?: number;
    currency: string;
    recurring: { interval: string };
  };
};

export type SubscriptionRes = {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: { data: SubscriptionItem[] };
} | null;

async function postStripe<T>(body: unknown): Promise<T> {
  const res = await fetch('/api/stripe/[...stripe]', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error || 'Request failed');
  }
  return data as T;
}

export function useCreateCustomer(options?: { onSuccess?: (data: CreateCustomerRes, vars: CreateCustomerVars) => void }) {
  return useApiMutation<CreateCustomerRes, CreateCustomerVars>(
    (vars) => postStripe<CreateCustomerRes>({ action: 'create-customer', ...vars }),
    { onSuccess: options?.onSuccess }
  );
}

export function useCreateCheckoutSession(options?: { onSuccess?: (data: CheckoutSessionRes, vars: CheckoutSessionVars) => void }) {
  return useApiMutation<CheckoutSessionRes, CheckoutSessionVars>(
    (vars) => postStripe<CheckoutSessionRes>({ action: 'create-checkout-session', ...vars }),
    { onSuccess: options?.onSuccess }
  );
}

export function useCreatePortalSession(options?: { onSuccess?: (data: PortalSessionRes, vars: PortalSessionVars) => void }) {
  return useApiMutation<PortalSessionRes, PortalSessionVars>(
    (vars) => postStripe<PortalSessionRes>({ action: 'create-portal-session', ...vars }),
    { onSuccess: options?.onSuccess }
  );
}

export function useCancelSubscription(options?: { onSuccess?: (data: CancelSubscriptionRes, vars: CancelSubscriptionVars) => void }) {
  return useApiMutation<CancelSubscriptionRes, CancelSubscriptionVars>(
    (vars) => postStripe<CancelSubscriptionRes>({ action: 'cancel-subscription', ...vars }),
    { onSuccess: options?.onSuccess }
  );
}

export function useSubscriptionStatus(customerId?: string) {
  const queryFn = useCallback(async () => {
    const data = await postStripe<{ subscription: SubscriptionRes }>({ action: 'get-subscription-status', customerId });
    return data.subscription;
  }, [customerId]);

  return useApi<SubscriptionRes>(
    ['stripe', 'subscription', customerId || 'none'],
    queryFn,
    { enabled: Boolean(customerId) }
  );
}

type EnvPrice = {
  id: string;
  unit_amount: number | null;
  currency: string;
  recurring?: { interval: string } | null;
  product: { id: string; name: string; description?: string | null } | null;
} | null;

export function useSubscriptionConfig() {
  const queryFn = useCallback(async () => {
    const data = await postStripe<{ config: { monthly: EnvPrice; yearly: EnvPrice } }>({ action: 'get-subscription-config' });
    return data.config;
  }, []);

  return useApi<{ monthly: EnvPrice; yearly: EnvPrice }>(['stripe', 'subscription-config'], queryFn, { enabled: true });
}


