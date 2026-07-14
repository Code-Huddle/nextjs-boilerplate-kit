import { useApiMutation } from '@/hooks/useApi';

export type PaymentIntentResponse = {
  clientSecret: string;
  amount: number;
  currency: string;
};

export function useCreatePaymentIntent() {
  return useApiMutation<PaymentIntentResponse, Record<string, never>>(async () => {
    const response = await fetch('/api/stripe', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Payment setup failed');
    return data as PaymentIntentResponse;
  });
}
