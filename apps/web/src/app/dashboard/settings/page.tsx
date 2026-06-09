'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Users, Shield, Database } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const settingsStats = [
    { id: 'school', title: 'School Info', value: 'Active', icon: Building, gradient: 'from-blue-500 to-blue-600' },
    { id: 'users', title: 'Total Users', value: 25, icon: Users, gradient: 'from-green-500 to-green-600' },
    { id: 'roles', title: 'Roles', value: 5, icon: Shield, gradient: 'from-purple-500 to-purple-600' },
    { id: 'system', title: 'System Status', value: 'Online', icon: Database, gradient: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure school settings and preferences"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {settingsStats.map((stat) => (
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

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school">School Information</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Update your school's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input defaultValue="Greenwood International School" />
                </div>
                <div className="space-y-2">
                  <Label>School Code</Label>
                  <Input defaultValue="GIS2024" />
                </div>
                <div className="space-y-2">
                  <Label>Principal Name</Label>
                  <Input defaultValue="Dr. Sarah Johnson" />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input defaultValue="2024-2025" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input defaultValue="123 Education Lane, Academic City" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+1-555-0123" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="info@greenwood.edu" />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input defaultValue="https://greenwood.edu" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure permissions for each user role</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Role permissions configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">User management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
