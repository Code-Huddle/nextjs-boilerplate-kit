'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
      if (role && role !== 'admin') {
        router.replace('/user');
      } else {
        setReady(true);
      }
    } catch {
      router.replace('/user');
    }
  }, [router]);

  if (!ready) return null;
  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">You are signed in as <Badge variant="destructive">Admin</Badge></p>
        </div>
        <div className="flex gap-2">
          <Button variant="futuristic" size="sm">New Report</Button>
          <Button variant="outline" size="sm">Manage Users</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 new today</p>
          </CardContent>
        </Card>
        <Card className="border-futuristic">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All resolved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-futuristic">
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>• Approved 2 new users</li>
            <li>• Updated billing settings</li>
            <li>• Reviewed access logs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
