'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SignInForm() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use a configured OAuth provider. No external password backend is bundled.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={() => signIn('github', { redirectTo: '/dashboard' })}>Continue with GitHub</Button>
        <Button className="w-full" variant="outline" onClick={() => signIn('google', { redirectTo: '/dashboard' })}>Continue with Google</Button>
      </CardContent>
    </Card>
  );
}
