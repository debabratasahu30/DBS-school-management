'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/Loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, UserPlus, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function TeachersPage() {
  const queryClient = useQueryClient();
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.get('/api/teachers'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [viewingTeacher, setViewingTeacher] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    qualification: '',
    experience: '',
    salary: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/teachers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', qualification: '', experience: '', salary: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/teachers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsModalOpen(false);
      setEditingTeacher(null);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', qualification: '', experience: '', salary: '' });
    },
  });

  const handleOpenModal = (teacher?: any) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        subject: teacher.subject,
        qualification: teacher.qualification,
        experience: teacher.experience,
        salary: teacher.salary,
      });
    } else {
      setEditingTeacher(null);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', qualification: '', experience: '', salary: '' });
    }
    setIsModalOpen(true);
  };

  const handleViewTeacher = (teacher: any) => {
    setViewingTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const teacherStats = [
    { id: 'all', title: 'Total Teachers', value: teachers?.data?.length || 0, icon: GraduationCap, gradient: 'from-blue-500 to-blue-600' },
    { id: 'active', title: 'Active Teachers', value: teachers?.data?.filter((t: any) => t.status === 'ACTIVE').length || 0, icon: Award, gradient: 'from-green-500 to-green-600' },
    { id: 'inactive', title: 'Inactive Teachers', value: teachers?.data?.filter((t: any) => t.status === 'INACTIVE').length || 0, icon: UserPlus, gradient: 'from-purple-500 to-purple-600' },
    { id: 'senior', title: 'Senior Teachers', value: teachers?.data?.filter((t: any) => t.experience >= 5).length || 0, icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return teachers?.data || mockTeachers;
    }
    if (selectedFilter === 'active') {
      return (teachers?.data || mockTeachers).filter((t: any) => t.status === 'ACTIVE');
    }
    if (selectedFilter === 'inactive') {
      return (teachers?.data || mockTeachers).filter((t: any) => t.status === 'INACTIVE');
    }
    if (selectedFilter === 'senior') {
      return (teachers?.data || mockTeachers).filter((t: any) => t.experience >= 5);
    }
    return teachers?.data || mockTeachers;
  };

  const mockTeachers = [
    { id: '1', employeeId: 'TCH0001', firstName: 'Emily', lastName: 'Brown', subject: 'Mathematics', experience: 8, status: 'ACTIVE' },
    { id: '2', employeeId: 'TCH0002', firstName: 'Michael', lastName: 'Davis', subject: 'Physics', experience: 6, status: 'ACTIVE' },
    { id: '3', employeeId: 'TCH0003', firstName: 'Sarah', lastName: 'Wilson', subject: 'Chemistry', experience: 7, status: 'ACTIVE' },
  ];

  const columns = [
    { key: 'employeeId' as const, header: 'Employee ID' },
    { key: 'name' as const, header: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'subject' as const, header: 'Subject' },
    { key: 'experience' as const, header: 'Experience (years)' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleViewTeacher(row)}>View</Button>
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
      </div>
    )},
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records and assignments"
        action={{ label: 'Add Teacher', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teacherStats.map((stat) => (
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
            <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
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
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingTeacher ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          {viewingTeacher && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <p className="text-sm font-medium">{viewingTeacher.employeeId}</p>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{viewingTeacher.firstName} {viewingTeacher.lastName}</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{viewingTeacher.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <p className="text-sm font-medium">{viewingTeacher.subject}</p>
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <p className="text-sm font-medium">{viewingTeacher.qualification}</p>
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <p className="text-sm font-medium">{viewingTeacher.experience} years</p>
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <p className="text-sm font-medium">${viewingTeacher.salary}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <StatusBadge status={viewingTeacher.status} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                <Button type="button" onClick={() => { setIsViewModalOpen(false); handleOpenModal(viewingTeacher); }}>Edit</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
