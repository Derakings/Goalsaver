import React, { HTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Alert({ variant = 'info', children, className, ...props }: AlertProps) {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertCircle,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
    },
  };

  const { container, icon: Icon } = variants[variant];

  return (
    <div
      className={cn(
        'flex items-start p-4 border rounded-lg',
        container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
