'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SignUpForm() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Your account is created through the OAuth provider you choose.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" onClick={() => signIn('github', { redirectTo: '/dashboard' })}>Continue with GitHub</Button>
        <Button className="w-full" variant="outline" onClick={() => signIn('google', { redirectTo: '/dashboard' })}>Continue with Google</Button>
      </CardContent>
    </Card>
  );
}
