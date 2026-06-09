'use client';

import { Bell, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth-store';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Assignment', message: 'Mathematics assignment due tomorrow', time: '2 hours ago', unread: true },
    { id: 2, title: 'Fee Reminder', message: 'Tuition fee payment due in 3 days', time: '5 hours ago', unread: true },
    { id: 3, title: 'Exam Schedule', message: 'Final exams start next week', time: '1 day ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + segments.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-gray-700 dark:text-white">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 shadow-xl z-50">
                <CardContent className="p-0">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-2 w-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* User avatar */}
          <Avatar>
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
