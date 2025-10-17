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
import Play from 'lucide-react/dist/esm/icons/play';
import Check from 'lucide-react/dist/esm/icons/check';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Mail from 'lucide-react/dist/esm/icons/mail';

export function PaymentDemo() {
  const [selectedAmount, setSelectedAmount] = useState(29.99);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const quickAmounts = [9.99, 29.99, 49.99, 99.99];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quick Amount Selection */}
      <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <span>Quick Test Amounts</span>
            <Badge variant="secondary" className="text-xs">
              <Play className="mr-1 h-3 w-3" />
              Interactive
            </Badge>
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
                className={`flex flex-col h-auto py-4 transition-all duration-200 ${
                  selectedAmount === amount 
                    ? "ring-2 ring-primary/20 shadow-lg" 
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-semibold">${amount}</span>
                  {selectedAmount === amount && <Check className="h-3 w-3" />}
                </div>
                <span className="text-xs opacity-70">Test Amount</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Component */}
      <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <span>Test Payment</span>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              Test Mode
            </Badge>
          </CardTitle>
          <CardDescription>
            Try a payment with the selected amount using Stripe test cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <Label htmlFor="payment-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email (for receipts)
            </Label>
            <Input
              id="payment-email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {message && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 mb-4 dark:border-blue-800 dark:bg-blue-950/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">{message}</p>
            </div>
          )}
          <StripeOneTimePayment
            amount={selectedAmount}
            currency="usd"
            customerEmail={email || undefined}
            onSuccess={(paymentIntentId) => {
              setMessage(`✅ Payment successful! ID: ${paymentIntentId}`);
            }}
            onError={(error) => {
              setMessage(`❌ Payment failed: ${error}`);
            }}
          />
        </CardContent>
      </Card>

      {/* Test Card Info */}
      <Card className="border-futuristic bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Quick Reference</span>
            <Badge variant="outline" className="text-xs">
              <Check className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-600 dark:text-green-400">Successful:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">4242 4242 4242 4242</code>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-600 dark:text-red-400">Declined:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">4000 0000 0000 0002</code>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-amber-700 dark:text-amber-300 text-xs">
                💡 Use any future expiry date (e.g., 12/25) and any 3-digit CVC.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
