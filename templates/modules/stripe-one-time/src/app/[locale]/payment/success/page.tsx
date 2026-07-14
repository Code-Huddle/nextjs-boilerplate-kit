import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Home from 'lucide-react/dist/esm/icons/home';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Payment Successful</CardTitle>
            <CardDescription className="text-muted-foreground">Your payment has been processed successfully.</CardDescription>
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                Completed
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="mr-1 h-3 w-3" />
                Secure
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="mb-3 font-semibold text-foreground">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    {paymentIntentId && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground"><span className="font-medium">Payment ID:</span></span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{paymentIntentId}</code>
                      </div>
                    )}
                    {sessionId && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-muted-foreground"><span className="font-medium">Session ID:</span></span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{sessionId}</code>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground"><span className="font-medium">Status:</span></span>
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full transition-all duration-200 hover:shadow-lg" variant="futuristic">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild className="w-full transition-all duration-200 hover:shadow-md" variant="outline">
                <Link href="/test-payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Another Payment
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Confirmation Email</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">A receipt will be sent to your email shortly.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
