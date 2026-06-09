'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure school settings and preferences"
      />

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                School Information
              </CardTitle>
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
                  <Label>Principal Name</Label>
                  <Input defaultValue="Dr. Sarah Johnson" />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input defaultValue="2024-2025" />
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
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure permissions for each role in the system.
              </p>
              <div className="space-y-4">
                {['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT', 'STUDENT'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{role}</p>
                      <p className="text-sm text-muted-foreground">
                        {role === 'ADMIN' && 'Full system access'}
                        {role === 'TEACHER' && 'Class and student management'}
                        {role === 'ACCOUNTANT' && 'Fee management and reports'}
                        {role === 'PARENT' && 'View child information'}
                        {role === 'STUDENT' && 'View personal information'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage system users and their access.
              </p>
              <Button>Create New User</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
