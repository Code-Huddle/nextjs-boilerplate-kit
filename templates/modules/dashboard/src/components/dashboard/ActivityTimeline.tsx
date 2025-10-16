import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  { time: '09:24', text: 'New user signed up' },
  { time: '10:02', text: 'Payment received from Acme Inc.' },
  { time: '11:47', text: 'Invoice INV-003 marked as overdue' },
  { time: '13:15', text: 'Subscription upgraded by Globex Corp.' },
];

export function ActivityTimeline() {
  return (
    <Card className="border-futuristic">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((a, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{a.time}</p>
                <p className="text-foreground">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


