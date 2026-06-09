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
import { BookOpen, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => api.get('/api/library-books'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publicationYear: '',
    totalCopies: '',
    availableCopies: '',
    location: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/library-books', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setFormData({ title: '', author: '', isbn: '', category: '', publisher: '', publicationYear: '', totalCopies: '', availableCopies: '', location: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/library-books/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', category: '', publisher: '', publicationYear: '', totalCopies: '', availableCopies: '', location: '' });
    },
  });

  const handleOpenModal = (book?: any) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        publisher: book.publisher,
        publicationYear: book.publicationYear,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        location: book.location,
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', category: '', publisher: '', publicationYear: '', totalCopies: '', availableCopies: '', location: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const mockBooks = [
    { id: '1', title: 'Introduction to Physics', author: 'John Doe', isbn: 'ISBN-9780000000', category: 'Science', available: 8, total: 10 },
    { id: '2', title: 'Advanced Mathematics', author: 'Jane Smith', isbn: 'ISBN-9780000001', category: 'Mathematics', available: 7, total: 10 },
    { id: '3', title: 'World History', author: 'Robert Johnson', isbn: 'ISBN-9780000002', category: 'History', available: 9, total: 10 },
  ];

  const libraryStats = [
    { id: 'all', title: 'Total Books', value: (books?.data || mockBooks).length, icon: BookOpen, gradient: 'from-blue-500 to-blue-600' },
    { id: 'available', title: 'Available', value: (books?.data || mockBooks).filter((b: any) => b.available > 0).length, icon: Users, gradient: 'from-green-500 to-green-600' },
    { id: 'borrowed', title: 'Borrowed', value: (books?.data || mockBooks).filter((b: any) => b.available < b.total).length, icon: AlertCircle, gradient: 'from-orange-500 to-orange-600' },
    { id: 'science', title: 'Science', value: (books?.data || mockBooks).filter((b: any) => b.category === 'Science').length, icon: TrendingUp, gradient: 'from-purple-500 to-purple-600' },
  ];

  const getFilteredData = () => {
    if (!selectedFilter || selectedFilter === 'all') {
      return books?.data || mockBooks;
    }
    if (selectedFilter === 'available') {
      return (books?.data || mockBooks).filter((b: any) => b.available > 0);
    }
    if (selectedFilter === 'borrowed') {
      return (books?.data || mockBooks).filter((b: any) => b.available < b.total);
    }
    if (selectedFilter === 'science') {
      return (books?.data || mockBooks).filter((b: any) => b.category === 'Science');
    }
    return books?.data || mockBooks;
  };

  const columns = [
    { key: 'title' as const, header: 'Title' },
    { key: 'author' as const, header: 'Author' },
    { key: 'isbn' as const, header: 'ISBN' },
    { key: 'category' as const, header: 'Category' },
    { key: 'available' as const, header: 'Available', render: (value: any, row: any) => `${value}/${row.total}` },
    { key: 'actions' as const, header: 'Actions', render: (value: any, row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Issue</Button>
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Manage library books and issues"
        action={{ label: 'Add Book', onClick: () => handleOpenModal() }}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {libraryStats.map((stat) => (
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
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Publication Year</Label>
                <Input
                  id="publicationYear"
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  id="totalCopies"
                  type="number"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  id="availableCopies"
                  type="number"
                  value={formData.availableCopies}
                  onChange={(e) => setFormData({ ...formData, availableCopies: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="SHELF-1"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingBook ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
