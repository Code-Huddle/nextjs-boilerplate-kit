import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionDemo } from '@/components/SubscriptionDemo';
import Shield from 'lucide-react/dist/esm/icons/shield';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import TestTube from 'lucide-react/dist/esm/icons/test-tube';
import Zap from 'lucide-react/dist/esm/icons/zap';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Info from 'lucide-react/dist/esm/icons/info';
import Link from 'next/link';

export default function TestSubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-12">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Badge variant="secondary" className="text-xs">
              <TestTube className="mr-1 h-3 w-3" />
              Test Environment
            </Badge>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-sm">
              <TestTube className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">Stripe Subscription Testing</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore recurring billing flows in a safe environment. Simulate plan changes, successful signups, and failures.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Shield className="mr-2 h-4 w-4" /> Secure Testing
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Zap className="mr-2 h-4 w-4" /> Real-time Processing
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Test Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Test Mode Status */}
            <Card className="border-futuristic bg-gradient-to-br from-primary/5 to-blue-500/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Test Mode Active</h3>
                    <p className="text-sm text-muted-foreground">Safe testing environment</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">No real charges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Full subscription flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Instant feedback</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Card Reference */}
            <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  <span>Test Cards</span>
                  <Badge variant="outline" className="text-xs">
                    <Info className="mr-1 h-3 w-3" /> Reference
                  </Badge>
                </CardTitle>
                <CardDescription>Use these cards to test different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Successful */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium text-foreground">Successful</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
                        <code className="text-xs font-mono">4242 4242 4242 4242</code>
                        <p className="text-xs text-muted-foreground mt-1">Visa</p>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
                        <code className="text-xs font-mono">5555 5555 5555 4444</code>
                        <p className="text-xs text-muted-foreground mt-1">Mastercard</p>
                      </div>
                    </div>
                  </div>

                  {/* Failed */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium text-foreground">Failed</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
                        <code className="text-xs font-mono">4000 0000 0000 0002</code>
                        <p className="text-xs text-muted-foreground mt-1">Declined</p>
                      </div>
                      <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
                        <code className="text-xs text-mono">4000 0000 0000 9995</code>
                        <p className="text-xs text-muted-foreground mt-1">Insufficient funds</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Note</p>
                        <p className="text-xs text-muted-foreground mt-1">Use any future expiry date and any 3-digit CVC.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Subscription Demo */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Interactive Subscription Demo</CardTitle>
                  <CardDescription className="text-base">Create a customer and test the end-to-end subscription flow</CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionDemo />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Processing</h3>
              <p className="text-sm text-muted-foreground">Real-time subscription activation and status updates</p>
            </CardContent>
          </Card>
          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure Testing</h3>
              <p className="text-sm text-muted-foreground">No real charges; safe to test repeatedly</p>
            </CardContent>
          </Card>
          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                <TestTube className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Multiple Scenarios</h3>
              <p className="text-sm text-muted-foreground">Test successful signups, cancellations, and errors</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
