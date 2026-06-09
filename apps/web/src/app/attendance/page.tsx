'use client';

import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark and manage student attendance"
      />

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
