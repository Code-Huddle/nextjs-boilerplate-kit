import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Home from 'lucide-react/dist/esm/icons/home';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Cancelled
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your payment was cancelled. No charges have been made.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold text-foreground">
                What happened?
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• You cancelled the payment process</p>
                <p>• No money has been charged to your account</p>
                <p>• You can try again anytime</p>
                {sessionId && (
                  <p className="mt-2">
                    <span className="font-medium">Session ID:</span> {sessionId}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full" variant="futuristic">
                <Link href="/">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Try Payment Again
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
