'use client';

import { Loader2 } from 'lucide-react';

export function Loader({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
