'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/Loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get('/api/classes'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    capacity: '',
    classTeacherId: '',
    academicYear: '2024-2025',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/classes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsModalOpen(false);
      setFormData({ name: '', grade: '', section: '', capacity: '', classTeacherId: '', academicYear: '2024-2025' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/classes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsModalOpen(false);
      setEditingClass(null);
      setFormData({ name: '', grade: '', section: '', capacity: '', classTeacherId: '', academicYear: '2024-2025' });
    },
  });

  const handleOpenModal = (classItem?: any) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        grade: classItem.grade,
        section: classItem.section,
        capacity: classItem.capacity,
        classTeacherId: classItem.classTeacherId,
        academicYear: classItem.academicYear,
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', grade: '', section: '', capacity: '', classTeacherId: '', academicYear: '2024-2025' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: any = {
      name: formData.name,
      grade: formData.grade,
      section: formData.section,
      capacity: parseInt(formData.capacity, 10),
      academicYear: formData.academicYear,
    };
    
    // Only include classTeacherId if it has a value
    if (formData.classTeacherId) {
      dataToSubmit.classTeacherId = formData.classTeacherId;
    }
    
    if (editingClass) {
      updateMutation.mutate({ id: editingClass.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const classStats = [
    { id: 'all', title: 'Total Classes', value: classes?.data?.length || 0, icon: BookOpen, gradient: 'from-blue-500 to-blue-600' },
    { id: 'grade9', title: 'Grade 9', value: classes?.data?.filter((c: any) => c.grade === '9').length || 0, icon: Users, gradient: 'from-green-500 to-green-600' },
    { id: 'grade10', title: 'Grade 10', value: classes?.data?.filter((c: any) => c.grade === '10').length || 0, icon: GraduationCap, gradient: 'from-purple-500 to-purple-600' },
    { id: 'sectionA', title: 'Section A', value: classes?.data?.filter((c: any) => c.section === 'A').length || 0, icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return classes?.data || mockClasses;
    }
    if (selectedFilter === 'grade9') {
      return (classes?.data || mockClasses).filter((c: any) => c.grade === '9');
    }
    if (selectedFilter === 'grade10') {
      return (classes?.data || mockClasses).filter((c: any) => c.grade === '10');
    }
    if (selectedFilter === 'sectionA') {
      return (classes?.data || mockClasses).filter((c: any) => c.section === 'A');
    }
    return classes?.data || mockClasses;
  };

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
    { key: 'actions' as const, header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
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
        title="Classes"
        description="Manage class sections and schedules"
        action={{ label: 'Add Class', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {classStats.map((stat) => (
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
            <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grade 9A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingClass ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
