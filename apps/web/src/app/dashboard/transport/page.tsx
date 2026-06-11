'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bus, MapPin, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function TransportPage() {
  const queryClient = useQueryClient();
  const { data: routes, isLoading } = useQuery({
    queryKey: ['transport-routes'],
    queryFn: () => api.get('/api/transport-routes'),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    routeName: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    capacity: '',
    startPoint: '',
    endPoint: '',
    stops: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/transport-routes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-routes'] });
      setIsModalOpen(false);
      setFormData({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '', capacity: '', startPoint: '', endPoint: '', stops: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/api/transport-routes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-routes'] });
      setIsModalOpen(false);
      setEditingRoute(null);
      setFormData({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '', capacity: '', startPoint: '', endPoint: '', stops: '' });
    },
  });

  const handleOpenModal = (route?: any) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeName: route.routeName,
        vehicleNumber: route.vehicleNumber,
        driverName: route.driverName,
        driverPhone: route.driverPhone,
        capacity: route.capacity,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        stops: route.stops,
      });
    } else {
      setEditingRoute(null);
      setFormData({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '', capacity: '', startPoint: '', endPoint: '', stops: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: any = {
      routeName: formData.routeName,
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      capacity: parseInt(formData.capacity, 10),
      startPoint: formData.startPoint,
      endPoint: formData.endPoint,
      stops: formData.stops,
    };
    
    if (editingRoute) {
      updateMutation.mutate({ id: editingRoute.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const transportStats = [
    { id: 'all', title: 'Total Routes', value: routes?.data?.length || 0, icon: MapPin, gradient: 'from-blue-500 to-blue-600' },
    { id: 'vehicles', title: 'Total Vehicles', value: 3, icon: Bus, gradient: 'from-green-500 to-green-600' },
    { id: 'students', title: 'Students Using', value: 105, icon: Users, gradient: 'from-purple-500 to-purple-600' },
    { id: 'capacity', title: 'Avg Capacity', value: '85%', icon: TrendingUp, gradient: 'from-orange-500 to-orange-600' },
  ];

  const getFilteredData = () => {
    return routes?.data || mockRoutes;
  };

  const mockRoutes = [
    { id: '1', routeName: 'Route A', vehicleNumber: 'KA-01-AB-1234', driver: 'John Doe', capacity: 40, students: 35 },
    { id: '2', routeName: 'Route B', vehicleNumber: 'KA-01-CD-5678', driver: 'Jane Smith', capacity: 40, students: 32 },
    { id: '3', routeName: 'Route C', vehicleNumber: 'KA-01-EF-9012', driver: 'Bob Johnson', capacity: 40, students: 38 },
  ];

  const columns = [
    { key: 'routeName' as const, header: 'Route Name' },
    { key: 'vehicleNumber' as const, header: 'Vehicle Number' },
    { key: 'driver' as const, header: 'Driver' },
    { key: 'capacity' as const, header: 'Capacity' },
    { key: 'students' as const, header: 'Students' },
    { key: 'actions' as const, header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>Edit</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transport"
        description="Manage school transport and routes"
        action={{ label: 'Add Route', onClick: () => handleOpenModal() }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {transportStats.map((stat) => (
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
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  placeholder="Route A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="KA-01-AB-1234"
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
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverPhone">Driver Phone</Label>
                <Input
                  id="driverPhone"
                  value={formData.driverPhone}
                  onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startPoint">Start Point</Label>
                <Input
                  id="startPoint"
                  value={formData.startPoint}
                  onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endPoint">End Point</Label>
                <Input
                  id="endPoint"
                  value={formData.endPoint}
                  onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="stops">Stops (comma separated)</Label>
                <Input
                  id="stops"
                  value={formData.stops}
                  onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                  placeholder="Stop 1, Stop 2, Stop 3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingRoute ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
