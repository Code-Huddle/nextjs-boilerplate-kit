'use client';

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreatePaymentIntent } from '@/hooks/useStripeOneTime';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ onMessage }: { onMessage: (message: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  return (
    <form className="space-y-4" onSubmit={async (event) => {
      event.preventDefault();
      if (!stripe || !elements) return;
      setLoading(true);
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/payment/success` },
      });
      if (result.error) onMessage(result.error.message ?? 'Payment failed');
      setLoading(false);
    }}>
      <PaymentElement />
      <Button className="w-full" disabled={!stripe || loading} type="submit">
        {loading ? 'Processing…' : 'Pay configured price'}
      </Button>
    </form>
  );
}

export function StripeOneTimePayment({ onMessage }: { onMessage: (message: string) => void }) {
  const [payment, setPayment] = useState<{ clientSecret: string; amount: number; currency: string } | null>(null);
  const mutation = useCreatePaymentIntent();

  if (!payment) {
    return (
      <Button className="w-full" disabled={mutation.isPending} onClick={async () => {
        try {
          setPayment(await mutation.mutateAsync({}));
        } catch (error) {
          onMessage(error instanceof Error ? error.message : 'Payment setup failed');
        }
      }}>
        {mutation.isPending ? 'Loading configured price…' : 'Start secure payment'}
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{new Intl.NumberFormat('en', { style: 'currency', currency: payment.currency }).format(payment.amount / 100)}</CardTitle>
        <CardDescription>This amount comes from the server-configured Stripe Price.</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
          <PaymentForm onMessage={onMessage} />
        </Elements>
      </CardContent>
    </Card>
  );
}
