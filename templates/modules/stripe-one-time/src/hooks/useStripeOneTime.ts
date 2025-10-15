import { useApiMutation } from '@/hooks/useApi';

type CreatePaymentIntentVars = {
  amount: number;
  currency?: string;
  email?: string;
  metadata?: Record<string, string>;
};

type CreatePaymentIntentRes = {
  clientSecret: string;
  error?: string;
};

async function postOneTime<T>(body: unknown): Promise<T> {
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

export function useCreatePaymentIntent() {
  return useApiMutation<CreatePaymentIntentRes, CreatePaymentIntentVars>(
    (vars) =>
      postOneTime<CreatePaymentIntentRes>({
        amount: vars.amount,
        currency: vars.currency || 'usd',
        email: vars.email,
        metadata: { type: 'one-time-payment', ...(vars.metadata || {}) },
      })
  );
}


