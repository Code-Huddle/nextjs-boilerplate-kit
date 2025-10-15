import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Home from 'lucide-react/dist/esm/icons/home';
import Link from 'next/link';

interface PaymentSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent as string;
  const sessionId = params.session_id as string;

  return (
    <div className="geometric-bg min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold text-foreground">
                Payment Details
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {paymentIntentId && (
                  <p>
                    <span className="font-medium">Payment ID:</span> {paymentIntentId}
                  </p>
                )}
                {sessionId && (
                  <p>
                    <span className="font-medium">Session ID:</span> {sessionId}
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span> Completed
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full" variant="futuristic">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
