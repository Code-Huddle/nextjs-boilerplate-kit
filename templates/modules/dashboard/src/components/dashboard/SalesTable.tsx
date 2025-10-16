import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const rows = [
  { id: 'INV-001', customer: 'Acme Inc.', amount: '$1,250.00', status: 'Paid' },
  { id: 'INV-002', customer: 'Globex Corp.', amount: '$980.00', status: 'Pending' },
  { id: 'INV-003', customer: 'Soylent Co.', amount: '$2,430.50', status: 'Overdue' },
  { id: 'INV-004', customer: 'Initech', amount: '$740.00', status: 'Paid' },
];

export function SalesTable() {
  return (
    <Card className="border-futuristic">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell>{r.customer}</TableCell>
                <TableCell className="text-right">{r.amount}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


