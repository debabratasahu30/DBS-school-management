'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function TeachersPage() {
  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.get('/api/teachers'),
  });

  const mockTeachers = [
    { id: '1', employeeId: 'TCH0001', firstName: 'Emily', lastName: 'Brown', subject: 'Mathematics', experience: 8, status: 'ACTIVE' },
    { id: '2', employeeId: 'TCH0002', firstName: 'Michael', lastName: 'Davis', subject: 'Physics', experience: 6, status: 'ACTIVE' },
    { id: '3', employeeId: 'TCH0003', firstName: 'Sarah', lastName: 'Wilson', subject: 'Chemistry', experience: 7, status: 'ACTIVE' },
  ];

  const columns = [
    { key: 'employeeId' as const, header: 'Employee ID' },
    { key: 'name' as const, header: 'Name', render: (value: any, row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'subject' as const, header: 'Subject' },
    { key: 'experience' as const, header: 'Experience (years)' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/teachers/${row.id}`}>View</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/teachers/${row.id}/edit`}>Edit</Link>
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records and assignments"
        action={{ label: 'Add Teacher', onClick: () => {} }}
      />
      <DataTable
        data={teachers?.data || mockTeachers}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
