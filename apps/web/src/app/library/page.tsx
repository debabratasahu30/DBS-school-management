'use client';

import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

export default function LibraryPage() {
  const mockBooks = [
    { id: '1', title: 'Introduction to Physics', author: 'John Doe', isbn: 'ISBN-9780000001', category: 'Science', totalCopies: 10, availableCopies: 8 },
    { id: '2', title: 'Advanced Mathematics', author: 'Jane Smith', isbn: 'ISBN-9780000002', category: 'Mathematics', totalCopies: 10, availableCopies: 6 },
    { id: '3', title: 'World History', author: 'Robert Johnson', isbn: 'ISBN-9780000003', category: 'History', totalCopies: 10, availableCopies: 10 },
  ];

  const columns = [
    { key: 'title' as const, header: 'Title' },
    { key: 'author' as const, header: 'Author' },
    { key: 'isbn' as const, header: 'ISBN' },
    { key: 'category' as const, header: 'Category' },
    { key: 'totalCopies' as const, header: 'Total Copies' },
    { key: 'availableCopies' as const, header: 'Available' },
    { key: 'actions' as const, header: 'Actions', render: () => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Issue</Button>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Manage library books and issue records"
        action={{ label: 'Add Book', onClick: () => {} }}
      />
      <DataTable
        data={mockBooks}
        columns={columns}
        searchable
        exportable
      />
    </div>
  );
}
