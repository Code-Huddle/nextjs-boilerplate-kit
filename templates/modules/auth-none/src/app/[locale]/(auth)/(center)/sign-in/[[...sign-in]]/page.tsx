'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication Disabled</CardTitle>
          <p className="text-sm text-gray-600">Authentication is not configured for this project</p>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 mb-4">
            To enable authentication, re-run the project creation command and select NextAuth or Supabase.
          </p>
          <Button className="w-full" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
