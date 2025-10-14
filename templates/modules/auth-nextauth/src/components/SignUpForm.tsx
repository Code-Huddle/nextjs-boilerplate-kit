'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For NextAuth, we typically use OAuth providers for sign up
      // This is a placeholder for credentials-based sign up
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setMessage('Sign up failed. Please try again.');
      } else {
        setMessage('Successfully signed up! Please sign in.');
      }
    } catch (error) {
      setMessage('An error occurred during sign up');
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
            <div className="text-3xl">🚀</div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Create Account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Join us and start building amazing things
        </CardDescription>
        <div className="mt-4 flex justify-center gap-2">
          <Badge variant="futuristic" size="sm">Free</Badge>
          <Badge variant="outline" size="sm">NextAuth.js</Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" variant="primary">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" variant="primary">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" variant="primary">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" variant="primary">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border-futuristic transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              required
              className="mt-1 rounded border-border/30 text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">
              I agree to the
              {' '}
              <button
                type="button"
                className="text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
              >
                Terms of Service
              </button>
              {' '}
              and
              {' '}
              <button
                type="button"
                className="text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
              >
                Privacy Policy
              </button>
            </span>
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
                    Creating Account...
                  </div>
                )
              : (
                  'Create Account'
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
          Already have an account?
          {' '}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
