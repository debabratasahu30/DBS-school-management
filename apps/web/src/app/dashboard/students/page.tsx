'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageLoader } from '@/components/Loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, GraduationCap, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/api/students'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'MALE',
    classId: '',
    guardianId: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/students', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', gender: 'MALE', classId: '', guardianId: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ firstName: '', lastName: '', email: '', gender: 'MALE', classId: '', guardianId: '' });
    },
  });

  const handleOpenModal = (student?: any) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        gender: student.gender,
        classId: student.classId,
        guardianId: student.guardianId,
      });
    } else {
      setEditingStudent(null);
      setFormData({ firstName: '', lastName: '', email: '', gender: 'MALE', classId: '', guardianId: '' });
    }
    setIsModalOpen(true);
  };

  const handleViewStudent = (student: any) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const studentStats = [
    { id: 'all', title: 'Total Students', value: students?.data?.length || 0, icon: Users, gradient: 'from-blue-500 to-blue-600' },
    { id: 'active', title: 'Active Students', value: students?.data?.filter((s: any) => s.status === 'ACTIVE').length || 0, icon: GraduationCap, gradient: 'from-green-500 to-green-600' },
    { id: 'inactive', title: 'Inactive Students', value: students?.data?.filter((s: any) => s.status === 'INACTIVE').length || 0, icon: UserPlus, gradient: 'from-purple-500 to-purple-600' },
    { id: 'male', title: 'Male Students', value: students?.data?.filter((s: any) => s.gender === 'MALE').length || 0, icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return students?.data || mockStudents;
    }
    if (selectedFilter === 'active') {
      return (students?.data || mockStudents).filter((s: any) => s.status === 'ACTIVE');
    }
    if (selectedFilter === 'inactive') {
      return (students?.data || mockStudents).filter((s: any) => s.status === 'INACTIVE');
    }
    if (selectedFilter === 'male') {
      return (students?.data || mockStudents).filter((s: any) => s.gender === 'MALE');
    }
    return students?.data || mockStudents;
  };

  const mockStudents = [
    { id: '1', admissionNo: 'ADM2024001', firstName: 'Alex', lastName: 'Johnson', class: 'Grade 9A', status: 'ACTIVE', gender: 'MALE' },
    { id: '2', admissionNo: 'ADM2024002', firstName: 'Emma', lastName: 'Williams', class: 'Grade 9B', status: 'ACTIVE', gender: 'FEMALE' },
    { id: '3', admissionNo: 'ADM2024003', firstName: 'Liam', lastName: 'Brown', class: 'Grade 10A', status: 'ACTIVE', gender: 'MALE' },
  ];

  const columns = [
    { key: 'admissionNo' as const, header: 'Admission No' },
    { key: 'name' as const, header: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'class' as const, header: 'Class' },
    { key: 'gender' as const, header: 'Gender' },
    { key: 'status' as const, header: 'Status', render: (value: any) => <StatusBadge status={value} /> },
    { key: 'actions' as const, header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleViewStudent(row)}>View</Button>
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
        title="Students"
        description="Manage student records and information"
        action={{ label: 'Add Student', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {studentStats.map((stat) => (
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
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
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
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingStudent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Admission No</Label>
                  <p className="text-sm font-medium">{viewingStudent.admissionNo}</p>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{viewingStudent.firstName} {viewingStudent.lastName}</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm font-medium">{viewingStudent.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <p className="text-sm font-medium">{viewingStudent.gender}</p>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <p className="text-sm font-medium">{viewingStudent.class?.name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <StatusBadge status={viewingStudent.status} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                <Button type="button" onClick={() => { setIsViewModalOpen(false); handleOpenModal(viewingStudent); }}>Edit</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
