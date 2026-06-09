'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Calendar, DollarSign, BookOpen, FileText, TrendingUp, TrendingDown, Activity, Clock, User, Briefcase, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/api/dashboard/stats'),
  });

  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => api.get('/api/dashboard/analytics'),
  });

  useEffect(() => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        setUserRole(authData.state?.user?.role || 'ADMIN');
      } catch (e) {
        console.error('Error parsing auth storage:', e);
      }
    }
  }, []);

  const handleCardClick = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'My Students':
        router.push('/dashboard/students');
        break;
      case 'Total Teachers':
        router.push('/dashboard/teachers');
        break;
      case 'Total Classes':
      case 'My Classes':
        router.push('/dashboard/classes');
        break;
      case 'Total Attendance':
      case "Today's Attendance":
      case 'My Attendance':
      case "Children's Attendance":
        router.push('/dashboard/attendance');
        break;
      case 'Total Exams':
      case 'Upcoming Exams':
      case 'Exam Results':
      case 'childrenExamResults':
        router.push('/dashboard/exams');
        break;
      case 'Total Fees':
      case 'Pending Fees':
      case 'childrenPendingFees':
        router.push('/dashboard/fees');
        break;
      case 'Total Notices':
        router.push('/dashboard/notices');
        break;
      case 'Total Leaves':
      case 'Pending Leaves':
      case 'pendingLeaves':
        router.push('/dashboard/leave');
        break;
      case 'Total Books':
      case 'Overdue Books':
      case 'Library Books':
        router.push('/dashboard/library');
        break;
      case 'Transport':
        router.push('/dashboard/transport');
        break;
      case 'Messages':
        router.push('/dashboard/messages');
        break;
      case 'Settings':
        router.push('/dashboard/settings');
        break;
      default:
        break;
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  const mockStats = {
    totalStudents: 50,
    totalTeachers: 10,
    totalClasses: 3,
    todayAttendance: 45,
    pendingFees: 15,
    totalNotices: 4,
    pendingLeaves: 5,
    overdueBooks: 2,
    attendanceRate: 90,
    feeCollectionRate: 85,
    studentGrowth: 12,
    teacherGrowth: 8,
  };

  const mockAttendanceData = [
    { name: 'Mon', present: 45, absent: 5, late: 2 },
    { name: 'Tue', present: 47, absent: 3, late: 1 },
    { name: 'Wed', present: 44, absent: 6, late: 3 },
    { name: 'Thu', present: 48, absent: 2, late: 1 },
    { name: 'Fri', present: 46, absent: 4, late: 2 },
    { name: 'Sat', present: 42, absent: 8, late: 4 },
  ];

  const mockFeeData = [
    { name: 'Jan', collected: 45000, pending: 12000 },
    { name: 'Feb', collected: 52000, pending: 8000 },
    { name: 'Mar', collected: 48000, pending: 15000 },
    { name: 'Apr', collected: 55000, pending: 5000 },
    { name: 'May', collected: 51000, pending: 10000 },
    { name: 'Jun', collected: 58000, pending: 7000 },
  ];

  const mockClassDistribution = [
    { name: 'Grade 9A', value: 17 },
    { name: 'Grade 9B', value: 16 },
    { name: 'Grade 10A', value: 17 },
  ];

  const activities = [
    { icon: Users, color: 'bg-blue-500', title: 'New student enrolled', time: '2 hours ago' },
    { icon: DollarSign, color: 'bg-green-500', title: 'Fee payment received', time: '4 hours ago' },
    { icon: Calendar, color: 'bg-yellow-500', title: 'Leave application submitted', time: '6 hours ago' },
    { icon: FileText, color: 'bg-purple-500', title: 'New notice published', time: '1 day ago' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader
          title="Dashboard"
          description="Overview of your school management system"
        />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(() => {
          let statsCards;
          if (userRole === 'ADMIN') {
            statsCards = [
              { 
                title: 'Total Students', 
                value: stats?.data?.totalStudents || mockStats.totalStudents, 
                icon: Users, 
                trend: { value: mockStats.studentGrowth, isPositive: true }, 
                gradient: 'from-blue-500 to-blue-600',
                subtitle: '+12% from last month',
                color: 'text-blue-600'
              },
              { 
                title: 'Total Teachers', 
                value: stats?.data?.totalTeachers || mockStats.totalTeachers, 
                icon: GraduationCap, 
                trend: { value: mockStats.teacherGrowth, isPositive: true }, 
                gradient: 'from-purple-500 to-purple-600',
                subtitle: '+8% from last month',
                color: 'text-purple-600'
              },
              { 
                title: 'Total Classes', 
                value: stats?.data?.totalClasses || mockStats.totalClasses, 
                icon: BookOpen, 
                gradient: 'from-indigo-500 to-indigo-600',
                subtitle: 'Active sections',
                color: 'text-indigo-600'
              },
              { 
                title: "Today's Attendance", 
                value: stats?.data?.todayAttendance || mockStats.todayAttendance, 
                icon: Calendar, 
                trend: { value: mockStats.attendanceRate, isPositive: true }, 
                gradient: 'from-pink-500 to-pink-600',
                subtitle: `${mockStats.attendanceRate}% attendance rate`,
                color: 'text-pink-600'
              },
              { 
                title: 'Pending Fees', 
                value: stats?.data?.pendingFees || mockStats.pendingFees, 
                icon: DollarSign, 
                trend: { value: mockStats.feeCollectionRate, isPositive: true }, 
                gradient: 'from-orange-500 to-orange-600',
                subtitle: `${mockStats.feeCollectionRate}% collected`,
                color: 'text-orange-600'
              },
              { 
                title: 'Total Notices', 
                value: stats?.data?.totalNotices || mockStats.totalNotices, 
                icon: FileText, 
                gradient: 'from-teal-500 to-teal-600',
                subtitle: 'Active announcements',
                color: 'text-teal-600'
              },
              { 
                title: 'Pending Leaves', 
                value: stats?.data?.pendingLeaves || mockStats.pendingLeaves, 
                icon: Calendar, 
                gradient: 'from-cyan-500 to-cyan-600',
                subtitle: 'Awaiting approval',
                color: 'text-cyan-600'
              },
              { 
                title: 'Overdue Books', 
                value: stats?.data?.overdueBooks || mockStats.overdueBooks, 
                icon: BookOpen, 
                trend: { value: 2, isPositive: false }, 
                gradient: 'from-rose-500 to-rose-600',
                subtitle: 'Need return',
                color: 'text-rose-600'
              },
            ];
          } else if (userRole === 'TEACHER') {
            statsCards = [
              { 
                title: 'My Classes', 
                value: stats?.data?.myClasses || 0, 
                icon: BookOpen, 
                gradient: 'from-blue-500 to-blue-600',
                subtitle: 'Assigned classes',
                color: 'text-blue-600'
              },
              { 
                title: 'My Students', 
                value: stats?.data?.myStudents || 0, 
                icon: Users, 
                gradient: 'from-purple-500 to-purple-600',
                subtitle: 'Total students',
                color: 'text-purple-600'
              },
              { 
                title: 'My Subjects', 
                value: stats?.data?.mySubjects || 0, 
                icon: Award, 
                gradient: 'from-indigo-500 to-indigo-600',
                subtitle: 'Teaching subjects',
                color: 'text-indigo-600'
              },
              {
                title: 'Total Exams',
                value: stats?.data?.totalExams || 0,
                icon: FileText,
                gradient: 'from-pink-500 to-pink-600',
                subtitle: 'All exams',
                color: 'text-pink-600'
              },
              {
                title: 'Upcoming Exams',
                value: stats?.data?.upcomingExams || 0,
                icon: FileText,
                gradient: 'from-rose-500 to-rose-600',
                subtitle: 'Scheduled exams',
                color: 'text-rose-600'
              },
              {
                title: 'My Salary',
                value: `$${stats?.data?.mySalary || 0}`,
                icon: DollarSign,
                gradient: 'from-green-500 to-green-600',
                subtitle: 'Monthly salary',
                color: 'text-green-600'
              },
              {
                title: 'Total Attendance',
                value: stats?.data?.totalAttendance || 0,
                icon: Calendar,
                gradient: 'from-orange-500 to-orange-600',
                subtitle: 'All attendance',
                color: 'text-orange-600'
              },
              {
                title: "Today's Attendance",
                value: stats?.data?.todayAttendance || 0,
                icon: Calendar,
                gradient: 'from-cyan-500 to-cyan-600',
                subtitle: 'Present today',
                color: 'text-cyan-600'
              },
              { 
                title: 'Qualification', 
                value: stats?.data?.qualification || 'N/A', 
                icon: Briefcase, 
                gradient: 'from-teal-500 to-teal-600',
                subtitle: 'Highest degree',
                color: 'text-teal-600'
              },
              { 
                title: 'Experience', 
                value: `${stats?.data?.experience || 0} years`, 
                icon: Clock, 
                gradient: 'from-cyan-500 to-cyan-600',
                subtitle: 'Teaching experience',
                color: 'text-cyan-600'
              },
            ];
          } else if (userRole === 'STUDENT') {
            statsCards = [
              { 
                title: 'My Name', 
                value: stats?.data?.personalInfo?.name || 'N/A', 
                icon: User, 
                gradient: 'from-blue-500 to-blue-600',
                subtitle: 'Student name',
                color: 'text-blue-600'
              },
              { 
                title: 'Class', 
                value: stats?.data?.personalInfo?.class || 'N/A', 
                icon: BookOpen, 
                gradient: 'from-purple-500 to-purple-600',
                subtitle: 'Current class',
                color: 'text-purple-600'
              },
              { 
                title: 'Admission No', 
                value: stats?.data?.personalInfo?.admissionNo || 'N/A', 
                icon: FileText, 
                gradient: 'from-indigo-500 to-indigo-600',
                subtitle: 'Student ID',
                color: 'text-indigo-600'
              },
              {
                title: 'Guardian',
                value: stats?.data?.personalInfo?.guardian || 'N/A',
                icon: Users,
                gradient: 'from-pink-500 to-pink-600',
                subtitle: 'Parent/Guardian',
                color: 'text-pink-600'
              },
              {
                title: 'Total Attendance',
                value: stats?.data?.totalAttendance || 0,
                icon: Calendar,
                gradient: 'from-green-500 to-green-600',
                subtitle: 'All attendance',
                color: 'text-green-600'
              },
              {
                title: 'My Attendance',
                value: stats?.data?.myAttendance || 0,
                icon: Calendar,
                gradient: 'from-teal-500 to-teal-600',
                subtitle: 'Days present',
                color: 'text-teal-600'
              },
              {
                title: 'Total Exams',
                value: stats?.data?.totalExamResults || 0,
                icon: Award,
                gradient: 'from-orange-500 to-orange-600',
                subtitle: 'All exams',
                color: 'text-orange-600'
              },
              {
                title: 'Total Fees',
                value: stats?.data?.totalFeePayments || 0,
                icon: DollarSign,
                gradient: 'from-rose-500 to-rose-600',
                subtitle: 'All fees',
                color: 'text-rose-600'
              },
              {
                title: 'Pending Fees',
                value: stats?.data?.pendingFees || 0,
                icon: DollarSign,
                gradient: 'from-amber-500 to-amber-600',
                subtitle: 'Fees due',
                color: 'text-amber-600'
              },
              {
                title: 'Total Books',
                value: stats?.data?.totalBookIssues || 0,
                icon: BookOpen,
                gradient: 'from-cyan-500 to-cyan-600',
                subtitle: 'All books',
                color: 'text-cyan-600'
              },
              {
                title: 'Library Books',
                value: stats?.data?.myBookIssues || 0,
                icon: BookOpen,
                gradient: 'from-lime-500 to-lime-600',
                subtitle: 'Books issued',
                color: 'text-lime-600'
              },
              {
                title: 'Total Leaves',
                value: stats?.data?.totalLeaveApplications || 0,
                icon: FileText,
                gradient: 'from-sky-500 to-sky-600',
                subtitle: 'All leaves',
                color: 'text-sky-600'
              },
              {
                title: 'Pending Leaves',
                value: stats?.data?.pendingLeaves || 0,
                icon: FileText,
                gradient: 'from-violet-500 to-violet-600',
                subtitle: 'Awaiting approval',
                color: 'text-violet-600'
              },
            ];
          } else if (userRole === 'PARENT') {
            statsCards = [
              {
                title: 'Total Children',
                value: stats?.data?.totalChildren || 0,
                icon: Users,
                gradient: 'from-blue-500 to-blue-600',
                subtitle: 'Children enrolled',
                color: 'text-blue-600'
              },
              {
                title: 'Total Attendance',
                value: stats?.data?.totalAttendance || 0,
                icon: Calendar,
                gradient: 'from-purple-500 to-purple-600',
                subtitle: 'All attendance',
                color: 'text-purple-600'
              },
              {
                title: "Children's Attendance",
                value: stats?.data?.childrenAttendance || 0,
                icon: Calendar,
                gradient: 'from-indigo-500 to-indigo-600',
                subtitle: 'Present today',
                color: 'text-indigo-600'
              },
              {
                title: 'Total Exams',
                value: stats?.data?.totalExamResults || 0,
                icon: Award,
                gradient: 'from-pink-500 to-pink-600',
                subtitle: 'All results',
                color: 'text-pink-600'
              },
              {
                title: 'Exam Results',
                value: stats?.data?.childrenExamResults || 0,
                icon: Award,
                gradient: 'from-rose-500 to-rose-600',
                subtitle: 'Total results',
                color: 'text-rose-600'
              },
              {
                title: 'Total Fees',
                value: stats?.data?.totalFeePayments || 0,
                icon: DollarSign,
                gradient: 'from-green-500 to-green-600',
                subtitle: 'All fees',
                color: 'text-green-600'
              },
              {
                title: 'Pending Fees',
                value: stats?.data?.childrenPendingFees || 0,
                icon: DollarSign,
                gradient: 'from-orange-500 to-orange-600',
                subtitle: 'Fees due',
                color: 'text-orange-600'
              },
              {
                title: 'Total Leaves',
                value: stats?.data?.totalLeaveApplications || 0,
                icon: FileText,
                gradient: 'from-teal-500 to-teal-600',
                subtitle: 'All leaves',
                color: 'text-teal-600'
              },
              {
                title: 'Pending Leaves',
                value: stats?.data?.pendingLeaves || 0,
                icon: FileText,
                gradient: 'from-cyan-500 to-cyan-600',
                subtitle: 'Awaiting approval',
                color: 'text-cyan-600'
              },
            ];
          } else if (userRole === 'ACCOUNTANT') {
            statsCards = [
              {
                title: 'Total Payments',
                value: stats?.data?.totalFeePayments || 0,
                icon: DollarSign,
                gradient: 'from-green-500 to-green-600',
                subtitle: 'All payments',
                color: 'text-green-600'
              },
              {
                title: 'Paid Fees',
                value: stats?.data?.paidFees || 0,
                icon: CheckCircle,
                gradient: 'from-blue-500 to-blue-600',
                subtitle: 'Completed payments',
                color: 'text-blue-600'
              },
              {
                title: 'Pending Fees',
                value: stats?.data?.pendingFees || 0,
                icon: AlertCircle,
                gradient: 'from-orange-500 to-orange-600',
                subtitle: 'Awaiting payment',
                color: 'text-orange-600'
              },
              {
                title: 'Overdue Fees',
                value: stats?.data?.overdueFees || 0,
                icon: TrendingUp,
                gradient: 'from-red-500 to-red-600',
                subtitle: 'Late payments',
                color: 'text-red-600'
              },
              {
                title: 'Total Students',
                value: stats?.data?.totalStudents || 0,
                icon: Users,
                gradient: 'from-purple-500 to-purple-600',
                subtitle: 'Enrolled students',
                color: 'text-purple-600'
              },
              {
                title: 'Total Classes',
                value: stats?.data?.totalClasses || 0,
                icon: BookOpen,
                gradient: 'from-teal-500 to-teal-600',
                subtitle: 'Active classes',
                color: 'text-teal-600'
              },
            ];
          } else {
            statsCards = [];
          }

          return statsCards.map((stat, index) => (
            <div key={stat.title} className="h-full">
              <Card 
                className="border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full flex flex-col relative group cursor-pointer"
                onClick={() => handleCardClick(stat.title)}
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
                  <div className="flex items-end justify-between">
                    <div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                      {stat.trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{stat.trend.value}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ));
        })()}
      </div>

      {/* Charts - Only for Admin */}
      {userRole === 'ADMIN' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-full">
            <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Attendance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 relative min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" fill="url(#presentGradient)" name="Present" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="absent" fill="url(#absentGradient)" name="Absent" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="late" fill="url(#lateGradient)" name="Late" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  Fee Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 relative min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockFeeData}>
                    <defs>
                      <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={3} fill="url(#feeGradient)" name="Collected" />
                    <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={3} fill="url(#pendingGradient)" name="Pending" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  Class Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 relative min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockClassDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockClassDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <Card className="border-0 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-3xl group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-all duration-500" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 relative">
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group/item"
                    >
                      <div className={`p-3 rounded-xl ${activity.color} shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                        <activity.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
