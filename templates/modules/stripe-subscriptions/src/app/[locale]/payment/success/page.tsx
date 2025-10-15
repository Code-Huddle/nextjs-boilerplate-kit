import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Home from 'lucide-react/dist/esm/icons/home';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Link from 'next/link';

interface PaymentSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;
  const subscriptionId = params.subscription_id as string;

  return (
    <div className="geometric-bg min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Subscription Active!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your subscription has been successfully activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold text-foreground">
                Subscription Details
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {subscriptionId && (
                  <p>
                    <span className="font-medium">Subscription ID:</span> {subscriptionId}
                  </p>
                )}
                {sessionId && (
                  <p>
                    <span className="font-medium">Session ID:</span> {sessionId}
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span> Active
                </p>
                <p>
                  <span className="font-medium">Next billing:</span> Next month
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
                <Link href="/dashboard">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Subscription
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
                Welcome to your new subscription! You can manage your billing anytime from your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
