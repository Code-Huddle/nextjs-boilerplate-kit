'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StripeOneTimePayment } from './StripeOneTimePayment';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import Zap from 'lucide-react/dist/esm/icons/zap';

export function PaymentDemo() {
  const [selectedAmount, setSelectedAmount] = useState(29.99);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const quickAmounts = [9.99, 29.99, 49.99, 99.99];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quick Amount Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Quick Test Amounts</span>
          </CardTitle>
          <CardDescription>
            Select a test amount to try the payment flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAmount(amount)}
                className="flex flex-col h-auto py-3"
              >
                <span className="font-semibold">${amount}</span>
                <span className="text-xs opacity-70">Test</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Test Payment</span>
            <Badge variant="outline" className="text-xs">
              Test Mode
            </Badge>
          </CardTitle>
          <CardDescription>
            Try a payment with the selected amount using Stripe test cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Label htmlFor="payment-email">Email (for receipts)</Label>
            <Input
              id="payment-email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && (
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
          )}
          <StripeOneTimePayment
            amount={selectedAmount}
            currency="usd"
            customerEmail={email || undefined}
            onSuccess={(paymentIntentId) => {
              setMessage(`Payment successful. ID: ${paymentIntentId}`);
            }}
            onError={(error) => {
              setMessage(error);
            }}
          />
        </CardContent>
      </Card>

      {/* Test Card Info */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">
            💡 Test Card Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-600 dark:text-green-400">✅ Successful:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">4242 4242 4242 4242</code>
            </div>
            <div>
              <span className="font-medium text-red-600 dark:text-red-400">❌ Declined:</span>
              <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">4000 0000 0000 0002</code>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Use any future expiry date (e.g., 12/25) and any 3-digit CVC.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
