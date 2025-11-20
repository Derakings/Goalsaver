import React from 'react';
import Link from 'next/link';
import { Banknote, Users, Trophy, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <Banknote className="w-5 h-5 text-green-500" />;
      case 'group_joined':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'target_reached':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'purchase_completed':
        return <ShoppingCart className="w-5 h-5 text-purple-500" />;
      default:
        return <Banknote className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
      </CardHeader>
      <CardBody>
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
                {activity.groupId && (
                  <Link
                    href={ROUTES.GROUP_DETAIL(activity.groupId)}
                    className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
