'use client';

import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExamsPage() {
  const mockExams = [
    { id: '1', name: 'Midterm Mathematics', type: 'MIDTERM', subject: 'Mathematics', class: 'Grade 9A', date: '2024-06-20', totalMarks: 100 },
    { id: '2', name: 'Final Physics', type: 'FINAL', subject: 'Physics', class: 'Grade 10A', date: '2024-06-25', totalMarks: 100 },
    { id: '3', name: 'Quiz Chemistry', type: 'QUIZ', subject: 'Chemistry', class: 'Grade 9B', date: '2024-06-22', totalMarks: 50 },
  ];

  const columns = [
    { key: 'name' as const, header: 'Exam Name' },
    { key: 'type' as const, header: 'Type', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'subject' as const, header: 'Subject' },
    { key: 'class' as const, header: 'Class' },
    { key: 'date' as const, header: 'Date' },
    { key: 'totalMarks' as const, header: 'Total Marks' },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Results</Button>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Manage exams and view results"
        action={{ label: 'Create Exam', onClick: () => {} }}
      />
      <DataTable
        data={mockExams}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
