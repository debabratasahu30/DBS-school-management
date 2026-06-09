'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, GraduationCap, Calendar, BookOpen, 
  DollarSign, Library, Bus, Bell, MessageSquare, FileText, 
  Settings, LogOut, Menu, X, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';

const allNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT'] },
  { name: 'Students', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Teachers', href: '/dashboard/teachers', icon: GraduationCap, roles: ['ADMIN'] },
  { name: 'Classes', href: '/dashboard/classes', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'ACCOUNTANT'] },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { name: 'Exams', href: '/dashboard/exams', icon: FileText, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { name: 'Fees', href: '/dashboard/fees', icon: DollarSign, roles: ['ADMIN', 'STUDENT', 'PARENT', 'ACCOUNTANT'] },
  { name: 'Library', href: '/dashboard/library', icon: Library, roles: ['ADMIN', 'STUDENT'] },
  { name: 'Transport', href: '/dashboard/transport', icon: Bus, roles: ['ADMIN'] },
  { name: 'Notices', href: '/dashboard/notices', icon: Bell, roles: ['ADMIN', 'STUDENT', 'PARENT', 'ACCOUNTANT'] },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT'] },
  { name: 'Leave', href: '/dashboard/leave', icon: FileText, roles: ['ADMIN', 'STUDENT', 'PARENT'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT'] },
];

export function Sidebar({ onCollapseChange }: { onCollapseChange?: (collapsed: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRole = user?.role || 'ADMIN';
  const navigation = allNavigation.filter(item => item.roles.includes(userRole));

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && (
              <span className="text-xl font-bold text-primary">SMS</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCollapse}
              className="hidden lg:flex"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            {!collapsed && (
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn('w-full justify-start', collapsed && 'px-2')}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-50 lg:hidden h-14 w-14 rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </>
  );
}
