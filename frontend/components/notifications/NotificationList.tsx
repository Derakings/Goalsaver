import React from 'react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { Spinner } from '@/components/ui/Spinner';
import { Bell } from 'lucide-react';

export function NotificationList() {
  const { notifications, loading, markAsRead } = useNotifications();

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No notifications yet</p>
        <p className="text-gray-500 text-sm mt-2">
          We&apos;ll notify you when something important happens
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => handleNotificationClick(notification.id, notification.isRead)}
        />
      ))}
    </div>
  );
}
