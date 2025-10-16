import { KpiCard } from '@/components/dashboard/KpiCard';
import { MiniChart } from '@/components/dashboard/MiniChart';
import { SalesTable } from '@/components/dashboard/SalesTable';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

type IPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage(_props: IPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <DashboardSidebar />
      <main className="flex-1 md:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview of your product metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">New Invoice</Button>
              <Button size="sm" variant="outline">Export</Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Revenue" value="$24,320" change="▲ 12% from last month" />
            <KpiCard title="Active Users" value="8,142" change="▲ 3% this week" />
            <KpiCard title="Conversion" value="4.2%" change="▼ 0.3% today" />
            <KpiCard title="Churn" value="1.1%" change="▼ 0.1% this month" />
          </div>

          <div className="mt-6">
            <Tabs defaultValue="traffic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="retention">Retention</TabsTrigger>
              </TabsList>
              <TabsContent value="traffic">
                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle>Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart values={[10, 12, 9, 14, 18, 21, 20, 24, 22, 26, 28, 30]} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sales">
                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle>Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart values={[5, 8, 6, 9, 7, 10, 13, 12, 15, 14, 16, 19]} color="#3b82f6" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="retention">
                <Card className="border-futuristic">
                  <CardHeader>
                    <CardTitle>Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MiniChart values={[30, 29, 28, 27, 25, 26, 27, 28, 29, 30, 31, 32]} color="#f59e0b" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-7">
            <div className="space-y-6 lg:col-span-4">
              <SalesTable />
            </div>
            <div className="space-y-6 lg:col-span-3">
              <ActivityTimeline />
              <Card className="border-futuristic">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary">New Invoice</Button>
                  <Button size="sm" variant="outline">Add Customer</Button>
                  <Button size="sm" variant="outline">Generate Report</Button>
                  <Button size="sm" variant="outline">Export Data</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


