import React from 'react';
import Link from 'next/link';
import { Users, Calendar, Target } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatDate, getDaysUntilDeadline } from '@/lib/utils';
import { GROUP_STATUS_LABELS, GROUP_STATUS_COLORS, ROUTES } from '@/lib/constants';
import type { Group } from '@/types';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const daysUntil = getDaysUntilDeadline(group.deadline);
  const statusColor = GROUP_STATUS_COLORS[group.status];

  return (
    <Link href={ROUTES.GROUP_DETAIL(group.id)}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Target className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className={statusColor}>
              {GROUP_STATUS_LABELS[group.status]}
            </Badge>
          </div>
        </div>

        <CardBody>
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {group.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {group.description}
          </p>

          {/* Target Item */}
          <div className="flex items-center text-sm text-gray-700 mb-4">
            <Target className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{group.targetItem}</span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                {formatCurrency(group.currentAmount)}
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(group.targetAmount)}
              </span>
            </div>
            <ProgressBar
              current={group.currentAmount}
              target={group.targetAmount}
              showPercentage={false}
              size="md"
            />
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{group.members.length} members</span>
            </div>
            {group.deadline && daysUntil !== null && daysUntil >= 0 && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{daysUntil === 0 ? 'Today' : `${daysUntil} days`}</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
