import React from 'react';
import { Bell, DollarSign, Users, Trophy, ShoppingCart } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'group_joined':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'target_reached':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'purchase_completed':
        return <ShoppingCart className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-colors',
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50 hover:bg-blue-100'
      )}
    >
      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            notification.isRead ? 'text-gray-900' : 'text-blue-900'
          )}
        >
          {notification.title}
        </p>
        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-2">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </div>
      )}
    </div>
  );
}
