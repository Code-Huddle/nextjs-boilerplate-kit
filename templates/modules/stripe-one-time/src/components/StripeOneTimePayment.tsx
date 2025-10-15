'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePaymentIntent } from '@/hooks/useStripeOneTime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

function PaymentForm({ amount, currency = 'usd', onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred');
        onError?.(submitError.message || 'An error occurred');
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/payment/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError?.(confirmError.message || 'Payment failed');
      } else {
        onSuccess?.(paymentIntent?.id || 'Payment successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          disabled
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          Amount: {currency.toUpperCase()} {amount}
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        variant="futuristic"
      >
        {isLoading ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
      </Button>
    </form>
  );
}

interface StripeOneTimePaymentProps {
  amount: number;
  currency?: string;
  customerEmail?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

export function StripeOneTimePayment({ 
  amount, 
  currency = 'usd', 
  customerEmail,
  onSuccess, 
  onError 
}: StripeOneTimePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const createPaymentIntentMutation = useCreatePaymentIntent();

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const data = await createPaymentIntentMutation.mutateAsync({ amount, currency, email: customerEmail });
      setClientSecret(data.clientSecret);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment intent';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>One-Time Payment</CardTitle>
          <CardDescription>
            Process a single payment using Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {currency.toUpperCase()} {amount}
              </p>
            </div>
            <Button
              onClick={createPaymentIntent}
              disabled={isLoading}
              className="w-full"
              variant="futuristic"
            >
              {isLoading ? 'Creating Payment...' : 'Create Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Enter your payment details to complete the transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#6366f1',
              },
            },
          }}
        >
          <PaymentForm
            amount={amount}
            currency={currency}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
