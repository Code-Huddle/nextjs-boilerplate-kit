'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setMessage('Invalid email or password');
      } else {
        setMessage('Successfully signed in!');
      }
    } catch (_error) {
      setMessage('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-futuristic group relative mx-auto w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardHeader className="relative z-10 pb-6 text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {message && (
          <Alert variant={message.toLowerCase().includes('error') || message.toLowerCase().includes('invalid') ? 'destructive' : 'default'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border-futuristic"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border-futuristic"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="futuristic"
            className="h-11 w-full text-base font-medium"
          >
            {loading
              ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </div>
                )
              : (
                  'Sign In'
                )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?
          {' '}
          <Link
            href="/sign-up"
            className="font-medium text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
