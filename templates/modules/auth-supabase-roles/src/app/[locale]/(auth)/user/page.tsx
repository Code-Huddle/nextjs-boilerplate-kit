'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { UserStatsCard } from '@/components/UserStatsCard';
import { RolesDarkModeToggle } from '@/components/RolesDarkModeToggle';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Bell from 'lucide-react/dist/esm/icons/bell';
import HardDrive from 'lucide-react/dist/esm/icons/hard-drive';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Settings from 'lucide-react/dist/esm/icons/settings';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Clock from 'lucide-react/dist/esm/icons/clock';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Star from 'lucide-react/dist/esm/icons/star';
import Download from 'lucide-react/dist/esm/icons/download';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Eye from 'lucide-react/dist/esm/icons/eye';
import User from 'lucide-react/dist/esm/icons/user';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your account and activities.
            </p>
          </div>
           <div className="flex items-center gap-2">
             <Badge variant="secondary" className="px-3 py-1">
               <User className="h-3 w-3 mr-1" />
               User
             </Badge>
             <RolesDarkModeToggle />
             <Button variant="futuristic" size="sm">
               <Settings className="h-4 w-4 mr-2" />
               Settings
             </Button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <UserStatsCard
            title="My Projects"
            value="5"
            change="2 updated today"
            changeType="positive"
            icon={FolderOpen}
            description="Active projects"
            progress={75}
            maxValue={10}
          />
          <UserStatsCard
            title="Notifications"
            value="12"
            change="3 unread"
            changeType="warning"
            icon={Bell}
            description="Total notifications"
          />
          <UserStatsCard
            title="Storage Used"
            value="6.8GB"
            change="of 10GB total"
            changeType="neutral"
            icon={HardDrive}
            description="68% of quota used"
            progress={68}
            maxValue={100}
          />
          <UserStatsCard
            title="Tasks Completed"
            value="23"
            change="+5 this week"
            changeType="positive"
            icon={CheckCircle}
            description="This month"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project Alpha Review</span>
                      <Badge variant="secondary">Due Today</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Client Meeting</span>
                      <Badge variant="outline">Tomorrow</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Code Review</span>
                      <Badge variant="outline">This Week</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      View all tasks →
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Project Alpha</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Project Beta</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Project Gamma</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>First project completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>5-day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-blue-500" />
                      <span>10 files uploaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-purple-500" />
                      <span>First collaboration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed task review</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Uploaded 3 files to Project Alpha</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Updated profile settings</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Shared project with team</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-futuristic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload File</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FolderOpen className="h-5 w-5" />
                      <span className="text-xs">New Project</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Share2 className="h-5 w-5" />
                      <span className="text-xs">Share</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Eye className="h-5 w-5" />
                      <span className="text-xs">View Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card className="border-futuristic">
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Project management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-futuristic">
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed activity log coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-futuristic">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Account settings interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
