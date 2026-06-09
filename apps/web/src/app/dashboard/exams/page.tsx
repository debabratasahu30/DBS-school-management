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
import { FileText, Calendar, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => api.get('/api/exams'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'MIDTERM',
    subjectId: '',
    classId: '',
    date: '',
    startTime: '',
    endTime: '',
    totalMarks: '',
    passingMarks: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/exams', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'MIDTERM', subjectId: '', classId: '', date: '', startTime: '', endTime: '', totalMarks: '', passingMarks: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/exams/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setIsModalOpen(false);
      setEditingExam(null);
      setFormData({ name: '', type: 'MIDTERM', subjectId: '', classId: '', date: '', startTime: '', endTime: '', totalMarks: '', passingMarks: '' });
    },
  });

  const handleOpenModal = (exam?: any) => {
    if (exam) {
      setEditingExam(exam);
      setFormData({
        name: exam.name,
        type: exam.type,
        subjectId: exam.subjectId,
        classId: exam.classId,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
      });
    } else {
      setEditingExam(null);
      setFormData({ name: '', type: 'MIDTERM', subjectId: '', classId: '', date: '', startTime: '', endTime: '', totalMarks: '', passingMarks: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExam) {
      updateMutation.mutate({ id: editingExam.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const mockExams = [
    { id: '1', name: 'Midterm Mathematics', type: 'MIDTERM', subject: 'Mathematics', class: 'Grade 9A', date: '2024-06-20', totalMarks: 100 },
    { id: '2', name: 'Final Physics', type: 'FINAL', subject: 'Physics', class: 'Grade 10A', date: '2024-06-25', totalMarks: 100 },
    { id: '3', name: 'Quiz Chemistry', type: 'QUIZ', subject: 'Chemistry', class: 'Grade 9B', date: '2024-06-22', totalMarks: 50 },
  ];

  const examStats = [
    { id: 'all', title: 'Total Exams', value: (exams?.data || mockExams).length, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
    { id: 'upcoming', title: 'Upcoming', value: (exams?.data || mockExams).filter((e: any) => new Date(e.date) >= new Date()).length, icon: Calendar, gradient: 'from-green-500 to-green-600' },
    { id: 'completed', title: 'Completed', value: (exams?.data || mockExams).filter((e: any) => new Date(e.date) < new Date()).length, icon: Award, gradient: 'from-purple-500 to-purple-600' },
    { id: 'midterm', title: 'Midterm', value: (exams?.data || mockExams).filter((e: any) => e.type === 'MIDTERM').length, icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return exams?.data || mockExams;
    }
    if (selectedFilter === 'upcoming') {
      return (exams?.data || mockExams).filter((e: any) => new Date(e.date) >= new Date());
    }
    if (selectedFilter === 'completed') {
      return (exams?.data || mockExams).filter((e: any) => new Date(e.date) < new Date());
    }
    if (selectedFilter === 'midterm') {
      return (exams?.data || mockExams).filter((e: any) => e.type === 'MIDTERM');
    }
    return exams?.data || mockExams;
  };

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
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        description="Manage exams and view results"
        action={{ label: 'Create Exam', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {examStats.map((stat) => (
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
            <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Exam Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MIDTERM">Midterm</SelectItem>
                    <SelectItem value="FINAL">Final</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input
                  id="passingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingExam ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
