'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SignInForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Disabled</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Authentication is not configured for this project.
        </p>
        <Button className="w-full" disabled>
          Sign In (Disabled)
        </Button>
      </CardContent>
    </Card>
  );
}
