import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
};

export function KpiCard({ title, value, change, icon }: KpiCardProps) {
  return (
    <Card className="border-futuristic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}


