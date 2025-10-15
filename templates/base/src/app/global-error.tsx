'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Home from 'lucide-react/dist/esm/icons/home';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import { routing } from '@/libs/i18nNavigation';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang={routing.defaultLocale}>
      <body className="min-h-screen bg-background">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Card className="border-futuristic">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 text-6xl font-bold text-red-500">
                  <AlertTriangle className="h-16 w-16" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Something went wrong
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  An unexpected error occurred. Please try again.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <Badge variant="destructive" className="mb-2">
                      Development Error
                    </Badge>
                    <pre className="text-xs text-red-800 dark:text-red-200 overflow-auto">
                      {error.message}
                    </pre>
                    {error.digest && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button onClick={reset} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full">
                    <a href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Go Home
                    </a>
                  </Button>
                </div>
                
                <div className="text-center text-xs text-muted-foreground">
                  <p>If this problem persists, please contact support.</p>
                  {error.digest && (
                    <p className="mt-1">Reference: {error.digest}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}
