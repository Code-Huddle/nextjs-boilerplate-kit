'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePaymentIntent } from '@/hooks/useStripeOneTime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Zap from 'lucide-react/dist/esm/icons/zap';

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
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Payment Error</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full transition-all duration-200 hover:shadow-lg"
        variant="futuristic"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Pay {currency.toUpperCase()} {amount}
          </>
        )}
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
      <Card className="w-full max-w-md border-futuristic bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <span>One-Time Payment</span>
            <Badge variant="outline" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              Ready
            </Badge>
          </CardTitle>
          <CardDescription>
            Process a single payment using Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <p className="text-3xl font-bold text-foreground">
                  {currency.toUpperCase()} {amount}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Secure payment processing</p>
            </div>
            <Button
              onClick={createPaymentIntent}
              disabled={isLoading}
              className="w-full transition-all duration-200 hover:shadow-lg"
              variant="futuristic"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Payment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-futuristic bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <span>Complete Payment</span>
          <Badge variant="secondary" className="text-xs">
            <Zap className="mr-1 h-3 w-3" />
            Active
          </Badge>
        </CardTitle>
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
