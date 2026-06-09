'use client';

import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function FeesPage() {
  const mockPayments = [
    { id: '1', student: 'Alex Johnson', feeType: 'Tuition Fee', amount: 5000, status: 'PAID', paymentDate: '2024-05-15' },
    { id: '2', student: 'Emma Williams', feeType: 'Tuition Fee', amount: 5000, status: 'PENDING', paymentDate: null },
    { id: '3', student: 'Liam Brown', feeType: 'Lab Fee', amount: 500, status: 'OVERDUE', paymentDate: null },
  ];

  const columns = [
    { key: 'student' as const, header: 'Student' },
    { key: 'feeType' as const, header: 'Fee Type' },
    { key: 'amount' as const, header: 'Amount', render: (value: any) => formatCurrency(value) },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'paymentDate' as const, header: 'Payment Date', render: (value: any) => value || '-' },
    { key: 'actions' as const, header: 'Actions', render: () => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Collect</Button>
        <Button variant="ghost" size="sm">Receipt</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees"
        description="Manage fee structures and payments"
        action={{ label: 'Collect Fee', onClick: () => {} }}
      />
      <DataTable
        data={mockPayments}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
