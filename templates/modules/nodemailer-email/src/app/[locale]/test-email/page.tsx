import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ResendTestForm } from '@/components/ResendTestForm';
import Mail from 'lucide-react/dist/esm/icons/mail';

export default function TestEmailPage() {
  return (
    <div className="geometric-bg min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/20 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> Email Utilities
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Emails</h1>
              <p className="text-sm text-muted-foreground">Send a development email to one or multiple recipients.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" /> Instructions
              </CardTitle>
              <CardDescription>
                Configure your SMTP settings in your environment variables. Then use the form to send a test email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Required Environment Variables:</p>
                <div className="rounded-md bg-muted/50 p-3 font-mono text-xs">
                  <div>SMTP_HOST="smtp.yourprovider.com"</div>
                  <div>SMTP_PORT="587" <span className="text-muted-foreground"># 465 for SSL</span></div>
                  <div>SMTP_SECURE="false" <span className="text-muted-foreground"># true if using port 465</span></div>
                  <div className="text-muted-foreground"># SMTP authentication (if required by your provider)</div>
                  <div>SMTP_USER="your-smtp-username"</div>
                  <div>SMTP_PASS="your-smtp-password"</div>
                  <div className="text-muted-foreground"># From address for outgoing emails</div>
                  <div>EMAIL_FROM="no-reply@yourdomain.com"</div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">Usage Tips:</p>
                <p>• Enter multiple recipients separated by commas.</p>
                <p>• Toggle the sample template to preview a styled transactional email.</p>
                <p>• This tool is intended for local/staging testing.</p>
              </div>
            </CardContent>
          </Card>

          {/* Form card */}
          <ResendTestForm />
        </div>
      </main>
    </div>
  );
}


