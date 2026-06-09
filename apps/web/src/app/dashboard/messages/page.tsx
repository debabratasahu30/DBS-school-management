'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => api.get('/api/messages'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    content: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/messages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setIsModalOpen(false);
      setFormData({ to: '', subject: '', content: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const mockMessages = [
    { id: '1', from: 'Emily Brown', subject: 'Mathematics Assignment', message: 'Please check the latest assignment submission...', date: '2024-06-10', unread: true },
    { id: '2', from: 'Michael Davis', subject: 'Physics Lab Report', message: 'The lab reports have been graded...', date: '2024-06-09', unread: false },
    { id: '3', from: 'Sarah Wilson', subject: 'Chemistry Project', message: 'Regarding the upcoming chemistry project...', date: '2024-06-08', unread: false },
  ];

  const allMessages = messages?.data || mockMessages;
  const unreadCount = allMessages.filter((m: any) => m.unread).length;
  const readCount = allMessages.filter((m: any) => !m.unread).length;
  const sentCount = allMessages.length; // Assuming all are sent for now
  const totalCount = unreadCount + readCount + sentCount;

  const messageStats = [
    { id: 'all', title: 'Total Messages', value: totalCount, icon: MessageSquare, gradient: 'from-blue-500 to-blue-600' },
    { id: 'unread', title: 'Unread', value: unreadCount, icon: Mail, gradient: 'from-orange-500 to-orange-600' },
    { id: 'sent', title: 'Sent', value: sentCount, icon: Send, gradient: 'from-green-500 to-green-600' },
    { id: 'read', title: 'Read', value: readCount, icon: CheckCircle, gradient: 'from-purple-500 to-purple-600' },
  ];

  const getFilteredData = () => {
    return messages?.data || mockMessages;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="View and send messages"
        action={{ label: 'New Message', onClick: () => setIsModalOpen(true) }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {messageStats.map((stat) => (
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Recent messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(getFilteredData() || mockMessages).map((msg: any) => (
              <div
                key={`${msg.id}-${selectedFilter || 'all'}`}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${msg.unread ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-accent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{msg.from}</span>
                  <span className="text-xs text-muted-foreground">{msg.date}</span>
                </div>
                <p className="text-sm font-medium mb-1">{msg.subject}</p>
                <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Send a new message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>To</Label>
              <Select value={formData.to} onValueChange={(value) => setFormData({ ...formData, to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEACHER">All Teachers</SelectItem>
                  <SelectItem value="STUDENT">All Students</SelectItem>
                  <SelectItem value="PARENT">All Parents</SelectItem>
                  <SelectItem value="SPECIFIC">Specific Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Message subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message..."
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFormData({ to: '', subject: '', content: '' })}>Clear</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                <Send className="h-4 w-4 mr-2" />
                {createMutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send New Message</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Select value={formData.to} onValueChange={(value) => setFormData({ ...formData, to: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">All Teachers</SelectItem>
                    <SelectItem value="STUDENT">All Students</SelectItem>
                    <SelectItem value="PARENT">All Parents</SelectItem>
                    <SelectItem value="SPECIFIC">Specific Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
