'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Github from 'lucide-react/dist/esm/icons/github';
import Mail from 'lucide-react/dist/esm/icons/mail';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mb-4 text-center text-sm">Or continue with</div>
          <div className="flex w-full flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="w-full"
            >
              <Github className="mr-2 size-4" />
              {' '}
              Sign in with GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full"
            >
              <Mail className="mr-2 size-4" />
              {' '}
              Sign in with Google
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
