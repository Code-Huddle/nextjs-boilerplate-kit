'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Successfully signed up! Please check your email to confirm your account.');
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
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">Sign Up</CardTitle>
        <CardDescription className="text-muted-foreground">
          Create your account to get started.
        </CardDescription>
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
                required
                value={formData.firstName}
                onChange={handleInputChange}
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
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" variant="primary">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
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
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleInputChange}
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
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
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

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="group relative overflow-hidden"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
              });
              if (error) setMessage(error.message);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-center">
              <div className="mr-2 text-lg">🚀</div>
              Google
            </div>
          </Button>
          <Button
            variant="outline"
            className="group relative overflow-hidden"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
              });
              if (error) setMessage(error.message);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-center">
              <div className="mr-2 text-lg">💼</div>
              GitHub
            </div>
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

        {message && (
          <div className="mt-4 text-center">
            <Badge variant={message.includes('error') ? 'destructive' : 'default'}>
              {message}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
