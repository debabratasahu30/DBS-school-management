'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function LeavePage() {
  const queryClient = useQueryClient();
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: () => api.get('/api/leave-requests'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'SICK',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/leave-requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      setIsModalOpen(false);
      setFormData({ studentId: '', type: 'SICK', startDate: '', endDate: '', reason: '', attachment: '' });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/api/leave-requests/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.put(`/api/leave-requests/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const mockLeaveRequests = [
    { id: '1', student: 'Alex Johnson', type: 'SICK', startDate: '2024-06-10', endDate: '2024-06-12', reason: 'Fever', status: 'APPROVED' },
    { id: '2', student: 'Emma Williams', type: 'PERSONAL', startDate: '2024-06-15', endDate: '2024-06-16', reason: 'Family event', status: 'PENDING' },
    { id: '3', student: 'Liam Brown', type: 'FAMILY', startDate: '2024-06-20', endDate: '2024-06-21', reason: 'Family emergency', status: 'REJECTED' },
  ];

  const leaveStats = [
    { id: 'all', title: 'Total Requests', value: (leaveRequests?.data || mockLeaveRequests).length, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { id: 'pending', title: 'Pending', value: (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'PENDING').length, icon: Calendar, gradient: 'from-orange-500 to-orange-600' },
    { id: 'approved', title: 'Approved', value: (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'APPROVED').length, icon: CheckCircle, gradient: 'from-green-500 to-green-600' },
    { id: 'rejected', title: 'Rejected', value: (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'REJECTED').length, icon: XCircle, gradient: 'from-red-500 to-red-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return leaveRequests?.data || mockLeaveRequests;
    }
    if (selectedFilter === 'pending') {
      return (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'PENDING');
    }
    if (selectedFilter === 'approved') {
      return (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'APPROVED');
    }
    if (selectedFilter === 'rejected') {
      return (leaveRequests?.data || mockLeaveRequests).filter((l: any) => l.status === 'REJECTED');
    }
    return leaveRequests?.data || mockLeaveRequests;
  };

  const columns = [
    { key: 'student' as const, header: 'Student' },
    { key: 'type' as const, header: 'Type' },
    { key: 'startDate' as const, header: 'Start Date' },
    { key: 'endDate' as const, header: 'End Date' },
    { key: 'reason' as const, header: 'Reason' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">View</Button>
        {row.status === 'PENDING' && (
          <>
            <Button variant="ghost" size="sm" onClick={() => approveMutation.mutate(row.id)}>Approve</Button>
            <Button variant="ghost" size="sm" onClick={() => rejectMutation.mutate(row.id)}>Reject</Button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="Manage student leave applications"
        action={{ label: 'Apply Leave', onClick: () => setIsModalOpen(true) }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leaveStats.map((stat) => (
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

      <DataTable
        key={selectedFilter || 'all'}
        data={getFilteredData()}
        columns={columns}
        searchable
        exportable
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alex Johnson</SelectItem>
                    <SelectItem value="2">Emma Williams</SelectItem>
                    <SelectItem value="3">Liam Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="PERSONAL">Personal Leave</SelectItem>
                    <SelectItem value="FAMILY">Family Emergency</SelectItem>
                    <SelectItem value="VACATION">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachment">Attachment (optional)</Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, attachment: (e.target.files?.[0] as any)?.name || '' })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
