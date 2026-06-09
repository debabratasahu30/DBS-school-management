'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} min-h-0`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
