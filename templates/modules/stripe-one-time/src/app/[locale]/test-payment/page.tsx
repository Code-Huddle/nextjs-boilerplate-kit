import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentDemo } from '@/components/PaymentDemo';
import Shield from 'lucide-react/dist/esm/icons/shield';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Link from 'next/link';

export default function TestPaymentPage() {

  return (
    <div className="geometric-bg min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Test Stripe Payments</h1>
              <p className="mt-2 text-muted-foreground">
                Try out one-time payments with Stripe in test mode
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                ← Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Test Mode Banner */}
        <Card className="border-futuristic mb-8 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Test Mode Active
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is a test environment. Use Stripe test card numbers for testing payments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Card Numbers */}
        <Card className="border-futuristic mb-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Test Card Numbers</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Use these test card numbers to simulate different payment scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Successful Payments</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><code className="rounded bg-muted px-2 py-1">4242 4242 4242 4242</code> - Visa</p>
                  <p><code className="rounded bg-muted px-2 py-1">5555 5555 5555 4444</code> - Mastercard</p>
                  <p><code className="rounded bg-muted px-2 py-1">3782 822463 10005</code> - American Express</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Failed Payments</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><code className="rounded bg-muted px-2 py-1">4000 0000 0000 0002</code> - Declined</p>
                  <p><code className="rounded bg-muted px-2 py-1">4000 0000 0000 9995</code> - Insufficient funds</p>
                  <p><code className="rounded bg-muted px-2 py-1">4000 0000 0000 0069</code> - Expired card</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Use any future expiry date (e.g., 12/25) and any 3-digit CVC for testing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Demo Component */}
        <PaymentDemo />
      </div>
    </div>
  );
}
