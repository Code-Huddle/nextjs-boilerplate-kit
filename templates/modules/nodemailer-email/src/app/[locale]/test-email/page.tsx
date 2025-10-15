import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ResendTestForm } from '@/components/ResendTestForm';
import Mail from 'lucide-react/dist/esm/icons/mail';

export default function TestEmailPage() {
  return (
    <div className="geometric-bg min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Test Resend Emails</h1>
              <p className="mt-2 text-muted-foreground">
                Send test emails to one or multiple recipients
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

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
        <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Instructions</span>
            </CardTitle>
            <CardDescription>
              Configure <code>RESEND_API_KEY</code> and <code>RESEND_FROM_EMAIL</code> in your env, then send a test email below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You can modify the HTML body to suit your needs. This page is provided for easy testing during development.
            </p>
          </CardContent>
        </Card>

        <ResendTestForm />
      </div>
    </div>
  );
}


