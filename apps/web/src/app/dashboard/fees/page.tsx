'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function FeesPage() {
  const queryClient = useQueryClient();
  const { data: fees, isLoading } = useQuery({
    queryKey: ['fees'],
    queryFn: () => api.get('/api/fees'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    amount: '',
    dueDate: '',
    academicYear: '2024-2025',
    description: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/fee-structures', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      setIsModalOpen(false);
      setFormData({ name: '', classId: '', amount: '', dueDate: '', academicYear: '2024-2025', description: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/fee-structures/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      setIsModalOpen(false);
      setEditingFee(null);
      setFormData({ name: '', classId: '', amount: '', dueDate: '', academicYear: '2024-2025', description: '' });
    },
  });

  const handleOpenModal = (fee?: any) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        name: fee.name,
        classId: fee.classId,
        amount: fee.amount,
        dueDate: fee.dueDate,
        academicYear: fee.academicYear,
        description: fee.description,
      });
    } else {
      setEditingFee(null);
      setFormData({ name: '', classId: '', amount: '', dueDate: '', academicYear: '2024-2025', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFee) {
      updateMutation.mutate({ id: editingFee.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const mockFees = [
    { id: '1', student: 'Alex Johnson', type: 'Tuition Fee', amount: 5000, status: 'PAID', dueDate: '2024-06-30' },
    { id: '2', student: 'Emma Williams', type: 'Tuition Fee', amount: 5000, status: 'PENDING', dueDate: '2024-06-30' },
    { id: '3', student: 'Liam Brown', type: 'Lab Fee', amount: 500, status: 'PAID', dueDate: '2024-06-30' },
  ];

  const feeStats = [
    { id: 'all', title: 'Total Payments', value: (fees?.data || mockFees).length, icon: DollarSign, gradient: 'from-green-500 to-green-600' },
    { id: 'paid', title: 'Paid', value: (fees?.data || mockFees).filter((f: any) => f.status === 'PAID').length, icon: CheckCircle, gradient: 'from-blue-500 to-blue-600' },
    { id: 'pending', title: 'Pending', value: (fees?.data || mockFees).filter((f: any) => f.status === 'PENDING').length, icon: AlertCircle, gradient: 'from-orange-500 to-orange-600' },
    { id: 'overdue', title: 'Overdue', value: (fees?.data || mockFees).filter((f: any) => f.status === 'OVERDUE').length, icon: TrendingUp, gradient: 'from-purple-500 to-purple-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return fees?.data || mockFees;
    }
    if (selectedFilter === 'paid') {
      return (fees?.data || mockFees).filter((f: any) => f.status === 'PAID');
    }
    if (selectedFilter === 'pending') {
      return (fees?.data || mockFees).filter((f: any) => f.status === 'PENDING');
    }
    if (selectedFilter === 'overdue') {
      return (fees?.data || mockFees).filter((f: any) => f.status === 'OVERDUE');
    }
    return fees?.data || mockFees;
  };

  const columns = [
    { key: 'student' as const, header: 'Student' },
    { key: 'type' as const, header: 'Fee Type' },
    { key: 'amount' as const, header: 'Amount' },
    { key: 'dueDate' as const, header: 'Due Date' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm">Payment</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees"
        description="Manage fee payments and structures"
        action={{ label: 'Add Fee Structure', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {feeStats.map((stat) => (
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
            <DialogTitle>{editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Fee Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tuition Fee"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grade 9A</SelectItem>
                    <SelectItem value="2">Grade 9B</SelectItem>
                    <SelectItem value="3">Grade 10A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingFee ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
