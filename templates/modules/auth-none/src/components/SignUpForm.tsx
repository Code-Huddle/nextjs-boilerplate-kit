'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Authentication is disabled. Cannot create account.');

    // Handle sign up logic here
    // TODO: Implement actual sign up logic
  };

  return (
    <Card className="border-futuristic group relative mx-auto w-full max-w-md overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-foreground">Sign Up</CardTitle>
        <CardDescription className="text-muted-foreground">
          Authentication is disabled for this project.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <Alert>
          <AlertDescription>
            Authentication is disabled. Account creation is not available. Re-run the generator and choose NextAuth or Supabase to enable it.
          </AlertDescription>
        </Alert>

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
                disabled
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
                disabled
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
              disabled
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
              disabled
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
              disabled
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled>
            Create Account (Disabled)
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
            disabled
            onClick={() => setMessage('Authentication module not configured')}
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
            disabled
            onClick={() => setMessage('Authentication module not configured')}
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
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
