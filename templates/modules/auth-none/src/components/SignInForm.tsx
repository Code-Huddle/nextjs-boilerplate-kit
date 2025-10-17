'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SignInForm() {
  return (
    <Card className="border-futuristic group relative mx-auto w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">Authentication Disabled</CardTitle>
        <CardDescription className="text-muted-foreground">This project was generated without an auth provider.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To enable authentication, re-run the generator and choose NextAuth or Supabase.
          </AlertDescription>
        </Alert>
        <Button className="w-full h-11" disabled>
          Sign In (Disabled)
        </Button>
      </CardContent>
    </Card>
  );
}
