import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionDemo } from '@/components/SubscriptionDemo';
import Shield from 'lucide-react/dist/esm/icons/shield';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Link from 'next/link';

export default function TestSubscriptionPage() {

  return (
    <div className="geometric-bg min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Test Stripe Subscriptions</h1>
              <p className="mt-2 text-muted-foreground">
                Try out subscription billing with Stripe in test mode
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
                  This is a test environment. Use Stripe test card numbers for testing subscriptions.
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
              Use these test card numbers to simulate different subscription scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Successful Subscriptions</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><code className="rounded bg-muted px-2 py-1">4242 4242 4242 4242</code> - Visa</p>
                  <p><code className="rounded bg-muted px-2 py-1">5555 5555 5555 4444</code> - Mastercard</p>
                  <p><code className="rounded bg-muted px-2 py-1">3782 822463 10005</code> - American Express</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Failed Subscriptions</h4>
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

        {/* Support Information */}
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 text-lg">
              💡 Customer Management Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <p>
                <strong>Programmatic Customer Creation:</strong> We are now creating new customers programmatically, 
                storing their customer ID in local storage, and fetching their status accordingly. 
                You can modify this logic as needed for your setup.
              </p>
              <p>
                <strong>How it works:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Create a customer using the form below</li>
                <li>Customer ID is stored in browser's local storage</li>
                <li>Subscription status is fetched using the stored customer ID</li>
                <li>All subscription management features work with the created customer</li>
              </ul>
              <p>
                <strong>For production:</strong> Replace local storage with your authentication system 
                and database to properly associate customers with user accounts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Demo Component */}
        <SubscriptionDemo />
      </div>
    </div>
  );
}
