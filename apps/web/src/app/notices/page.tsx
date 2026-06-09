'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Bell, Calendar, User } from 'lucide-react';

export default function NoticesPage() {
  const mockNotices = [
    { id: '1', title: 'Summer Vacation Announcement', category: 'GENERAL', content: 'School will be closed for summer vacation from June 15 to July 15.', publishDate: '2024-06-01', publishedBy: 'John Smith' },
    { id: '2', title: 'Mid-Term Exam Schedule', category: 'ACADEMIC', content: 'Mid-term examinations will commence from June 20.', publishDate: '2024-06-02', publishedBy: 'John Smith' },
    { id: '3', title: 'Annual Sports Day', category: 'EVENT', content: 'Annual sports day will be held on July 20.', publishDate: '2024-06-03', publishedBy: 'John Smith' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notices"
        description="View and manage school notices and announcements"
        action={{ label: 'Create Notice', onClick: () => {} }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockNotices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{notice.title}</CardTitle>
                <StatusBadge status={notice.category} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{notice.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(notice.publishDate)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {notice.publishedBy}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
