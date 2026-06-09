'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function NoticesPage() {
  const queryClient = useQueryClient();
  const { data: notices, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => api.get('/api/notices'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    targetAudience: 'STUDENT,TEACHER,PARENT',
    publishDate: '',
    expiryDate: '',
    attachments: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/notices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', category: 'GENERAL', targetAudience: 'STUDENT,TEACHER,PARENT', publishDate: '', expiryDate: '', attachments: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/notices/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setIsModalOpen(false);
      setEditingNotice(null);
      setFormData({ title: '', content: '', category: 'GENERAL', targetAudience: 'STUDENT,TEACHER,PARENT', publishDate: '', expiryDate: '', attachments: '' });
    },
  });

  const handleOpenModal = (notice?: any) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        targetAudience: notice.targetAudience,
        publishDate: notice.publishDate,
        expiryDate: notice.expiryDate,
        attachments: notice.attachments,
      });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', content: '', category: 'GENERAL', targetAudience: 'STUDENT,TEACHER,PARENT', publishDate: '', expiryDate: '', attachments: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      updateMutation.mutate({ id: editingNotice.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const noticeStats = [
    { id: 'all', title: 'Total Notices', value: notices?.data?.length || 0, icon: Bell, gradient: 'from-blue-500 to-blue-600' },
    { id: 'active', title: 'Active', value: 4, icon: CheckCircle, gradient: 'from-green-500 to-green-600' },
    { id: 'expired', title: 'Expired', value: 2, icon: AlertCircle, gradient: 'from-red-500 to-red-600' },
    { id: 'month', title: 'This Month', value: 3, icon: Calendar, gradient: 'from-purple-500 to-purple-600' },
  ];

  const getFilteredData = () => {
    return notices?.data || mockNotices;
  };

  const mockNotices = [
    { id: '1', title: 'Summer Vacation Announcement', category: 'GENERAL', content: 'School will be closed for summer vacation from June 15 to July 15.', publishDate: '2024-06-01', expiryDate: '2024-07-01' },
    { id: '2', title: 'Mid-Term Exam Schedule', category: 'ACADEMIC', content: 'Mid-term examinations will commence from June 20. Please check the detailed schedule.', publishDate: '2024-06-05', expiryDate: '2024-06-30' },
    { id: '3', title: 'Annual Sports Day', category: 'EVENT', content: 'Annual sports day will be held on July 20. All students are required to participate.', publishDate: '2024-06-10', expiryDate: '2024-07-20' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notices"
        description="View and manage school announcements"
        action={{ label: 'Create Notice', onClick: () => handleOpenModal() }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {noticeStats.map((stat) => (
          <Card
            key={stat.id}
            onClick={() => setSelectedFilter(selectedFilter === stat.id ? null : stat.id)}
            className={`border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full flex flex-col relative group cursor-pointer ${
              selectedFilter === stat.id ? 'ring-2 ring-offset-2 ring-primary' : ''
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex-1 flex flex-col justify-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(getFilteredData() || mockNotices).map((notice: any) => (
          <Card key={`${notice.id}-${selectedFilter || 'all'}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{notice.title}</CardTitle>
                <Badge variant="outline">{notice.category}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {notice.publishDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{notice.content}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View</Button>
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(notice)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="TEACHER">Teachers</SelectItem>
                    <SelectItem value="PARENT">Parents</SelectItem>
                    <SelectItem value="STUDENT,TEACHER,PARENT">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingNotice ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
