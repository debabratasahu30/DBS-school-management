'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClassesPage() {
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get('/api/classes'),
  });

  const mockClasses = [
    { id: '1', name: 'Grade 9A', grade: '9', section: 'A', capacity: 30, students: 17, classTeacher: 'Emily Brown' },
    { id: '2', name: 'Grade 9B', grade: '9', section: 'B', capacity: 30, students: 16, classTeacher: 'Michael Davis' },
    { id: '3', name: 'Grade 10A', grade: '10', section: 'A', capacity: 30, students: 17, classTeacher: 'Sarah Wilson' },
  ];

  const columns = [
    { key: 'name' as const, header: 'Class Name' },
    { key: 'grade' as const, header: 'Grade' },
    { key: 'section' as const, header: 'Section' },
    { key: 'capacity' as const, header: 'Capacity' },
    { key: 'students' as const, header: 'Students' },
    { key: 'classTeacher' as const, header: 'Class Teacher' },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/classes/${row.id}`}>View</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/classes/${row.id}/timetable`}>Timetable</Link>
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage class sections and schedules"
        action={{ label: 'Add Class', onClick: () => {} }}
      />
      <DataTable
        data={classes?.data || mockClasses}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
