'use client';

import React, { useEffect } from 'react';
import { CheckCheck } from 'lucide-react';
import { NotificationList } from '@/components/notifications/NotificationList';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { fetchNotifications, markAllAsRead, unreadCount } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <NotificationList />
      </div>
    </div>
  );
}
