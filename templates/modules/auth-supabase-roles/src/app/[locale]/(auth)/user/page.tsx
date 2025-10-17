'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function UserPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
      if (role === 'admin') {
        router.replace('/admin');
      } else {
        setReady(true);
      }
    } catch {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;
  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Dashboard</h1>
          <p className="text-sm text-muted-foreground">You are signed in as <Badge variant="secondary">User</Badge></p>
        </div>
        <div className="flex gap-2">
          <Button variant="futuristic" size="sm">New Ticket</Button>
          <Button variant="outline" size="sm">View Docs</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">My Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 updated today</p>
          </CardContent>
        </Card>
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 unread</p>
          </CardContent>
        </Card>
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">of 10GB used</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-futuristic">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>• Commented on Project Alpha</li>
            <li>• Uploaded 3 files</li>
            <li>• Updated profile settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
