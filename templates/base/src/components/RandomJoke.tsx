'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function RandomJoke() {
  const [joke, setJoke] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchJoke = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.chucknorris.io/jokes/random');
      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }

      const data = await response.json();
      setJoke(data.value);
    } catch (err) {
      setError('Failed to fetch joke. Please try again.');
      console.error('Error fetching joke:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-futuristic group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardHeader className="relative z-10 pb-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-3xl">🎭</div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Random Chuck Norris Joke
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Powered by Chuck Norris API
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="futuristic" size="sm">API Demo</Badge>
          <Badge variant="outline" size="sm">React Query</Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {joke && (
          <div className="rounded-2xl border border-border/20 bg-muted/30 p-4 backdrop-blur-sm">
            <p className="leading-relaxed text-foreground">
              "
              {joke}
              "
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={fetchJoke}
          disabled={loading}
          variant="futuristic"
          className="w-full"
        >
          {loading
            ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Loading...
                </div>
              )
            : (
                'Get Random Joke'
              )}
        </Button>

        <p className="text-center text-xs text-muted-foreground/70">
          Click the button above to fetch a random Chuck Norris joke from the API
        </p>
      </CardContent>
    </Card>
  );
}
