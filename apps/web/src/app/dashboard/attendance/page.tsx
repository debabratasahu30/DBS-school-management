'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function AttendancePage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const attendanceStats = [
    { id: 'all', title: 'Today Present', value: 45, icon: CheckCircle, gradient: 'from-green-500 to-green-600' },
    { id: 'absent', title: 'Today Absent', value: 5, icon: XCircle, gradient: 'from-red-500 to-red-600' },
    { id: 'late', title: 'Late Arrivals', value: 2, icon: Clock, gradient: 'from-orange-500 to-orange-600' },
    { id: 'rate', title: 'Attendance Rate', value: '90%', icon: Users, gradient: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark and manage student attendance"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {attendanceStats.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9a">Grade 9A</SelectItem>
                  <SelectItem value="9b">Grade 9B</SelectItem>
                  <SelectItem value="10a">Grade 10A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input type="date" className="w-full outline-none" />
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Load Students</Button>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Student</th>
                  <th className="text-left p-2">Admission No</th>
                  <th className="text-center p-2">Present</th>
                  <th className="text-center p-2">Absent</th>
                  <th className="text-center p-2">Late</th>
                  <th className="text-center p-2">Excused</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Alex Johnson</td>
                  <td className="p-2">ADM2024001</td>
                  <td className="p-2 text-center"><input type="radio" name="status1" defaultChecked /></td>
                  <td className="p-2 text-center"><input type="radio" name="status1" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status1" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status1" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Emma Williams</td>
                  <td className="p-2">ADM2024002</td>
                  <td className="p-2 text-center"><input type="radio" name="status2" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status2" defaultChecked /></td>
                  <td className="p-2 text-center"><input type="radio" name="status2" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status2" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Liam Brown</td>
                  <td className="p-2">ADM2024003</td>
                  <td className="p-2 text-center"><input type="radio" name="status3" defaultChecked /></td>
                  <td className="p-2 text-center"><input type="radio" name="status3" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status3" /></td>
                  <td className="p-2 text-center"><input type="radio" name="status3" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
