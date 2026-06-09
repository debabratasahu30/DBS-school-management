'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function StudentsPage() {
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/api/students'),
  });

  const mockStudents = [
    { id: '1', admissionNo: 'ADM2024001', firstName: 'Alex', lastName: 'Johnson', class: 'Grade 9A', status: 'ACTIVE', gender: 'MALE' },
    { id: '2', admissionNo: 'ADM2024002', firstName: 'Emma', lastName: 'Williams', class: 'Grade 9B', status: 'ACTIVE', gender: 'FEMALE' },
    { id: '3', admissionNo: 'ADM2024003', firstName: 'Liam', lastName: 'Brown', class: 'Grade 10A', status: 'ACTIVE', gender: 'MALE' },
  ];

  const columns = [
    { key: 'admissionNo' as const, header: 'Admission No' },
    { key: 'name' as const, header: 'Name', render: (value: any, row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'class' as const, header: 'Class' },
    { key: 'gender' as const, header: 'Gender' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/students/${row.id}`}>View</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/students/${row.id}/edit`}>Edit</Link>
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage student records and information"
        action={{ label: 'Add Student', onClick: () => {} }}
      />
      <DataTable
        data={students?.data || mockStudents}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
