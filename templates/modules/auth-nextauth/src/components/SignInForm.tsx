'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        // Redirect or update UI as needed
      }
    } catch (error) {
      setMessage('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-futuristic group relative mx-auto w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardHeader className="relative z-10 pb-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <div className="text-3xl">🔐</div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account to continue
        </CardDescription>
        <div className="mt-4 flex justify-center gap-2">
          <Badge variant="futuristic" size="sm">Authentication</Badge>
          <Badge variant="outline" size="sm">NextAuth.js</Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" variant="primary">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" variant="primary">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border/30 text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              className="text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="futuristic"
            className="h-12 w-full text-base font-medium"
          >
            {loading
              ? (
                  <div className="flex items-center gap-2">
                    <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing In...
                  </div>
                )
              : (
                  'Sign In'
                )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-futuristic h-11">
            <div className="mr-2 text-lg">🔍</div>
            Google
          </Button>
          <Button variant="outline" className="border-futuristic h-11">
            <div className="mr-2 text-lg">💼</div>
            GitHub
          </Button>
        </div>

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
