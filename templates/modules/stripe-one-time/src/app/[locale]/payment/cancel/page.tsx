import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Home from 'lucide-react/dist/esm/icons/home';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Shield from 'lucide-react/dist/esm/icons/shield';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Info from 'lucide-react/dist/esm/icons/info';
import Link from 'next/link';

interface PaymentCancelPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentCancelPage({ searchParams }: PaymentCancelPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;

  return (
    <div className="geometric-bg min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50">
              <XCircle className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Payment Cancelled</CardTitle>
            <CardDescription className="text-muted-foreground">Your payment was cancelled. No charges have been made.</CardDescription>
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                No Charges Made
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">What happened?</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <span>You cancelled the payment process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>No money has been charged to your account</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span>You can try again anytime</span>
                    </div>
                    {sessionId && (
                      <div className="mt-3 rounded bg-muted p-2">
                        <p className="text-xs"><span className="font-medium">Session ID:</span> {sessionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full transition-all duration-200 hover:shadow-lg" variant="futuristic">
                <Link href="/test-payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Try Payment Again
                </Link>
              </Button>
              <Button asChild className="w-full transition-all duration-200 hover:shadow-md" variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Need help?</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Contact our support team for assistance.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
