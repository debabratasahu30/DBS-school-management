import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      PRESENT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      ABSENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      LATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      ISSUED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      RETURNED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(status), className)}>
      {status}
    </span>
  );
}
