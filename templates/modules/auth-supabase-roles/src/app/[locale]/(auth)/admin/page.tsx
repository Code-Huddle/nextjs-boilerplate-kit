'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '@/components/AdminSidebar';
import { AdminStatsCard } from '@/components/AdminStatsCard';
import { RecentActivity } from '@/components/RecentActivity';
import Users from 'lucide-react/dist/esm/icons/users';
import Shield from 'lucide-react/dist/esm/icons/shield';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Database from 'lucide-react/dist/esm/icons/database';
import Activity from 'lucide-react/dist/esm/icons/activity';
import Clock from 'lucide-react/dist/esm/icons/clock';
import UserCheck from 'lucide-react/dist/esm/icons/user-check';
import UserX from 'lucide-react/dist/esm/icons/user-x';
import Server from 'lucide-react/dist/esm/icons/server';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';

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
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="md:pl-64">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your system.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <Button variant="futuristic" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminStatsCard
              title="Total Users"
              value="1,248"
              change="+12% from last month"
              changeType="positive"
              icon={Users}
              description="Active registered users"
              badge="Live"
            />
            <AdminStatsCard
              title="Pending Approvals"
              value="7"
              change="2 new today"
              changeType="warning"
              icon={UserCheck}
              description="Users awaiting approval"
              badge="Urgent"
            />
            <AdminStatsCard
              title="System Health"
              value="99.9%"
              change="All systems operational"
              changeType="positive"
              icon={Server}
              description="Uptime this month"
            />
            <AdminStatsCard
              title="Security Alerts"
              value="3"
              change="1 resolved today"
              changeType="negative"
              icon={Shield}
              description="Active security issues"
              badge="Monitor"
            />
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Connection Pool</span>
                        <Badge variant="secondary">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Query Performance</span>
                        <Badge variant="secondary">Optimal</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Backup Status</span>
                        <Badge variant="secondary">Up to date</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last backup: 2 hours ago
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>User john.doe approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>System backup completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>Security scan in progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Database optimized</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <RecentActivity />
                
                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New registrations today</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active sessions</span>
                        <span className="font-semibold">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API calls (24h)</span>
                        <span className="font-semibold">12.4K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Error rate</span>
                        <span className="font-semibold text-green-600">0.02%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response time</span>
                        <span className="font-semibold">142ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle>Security Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Security monitoring interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
