import React from 'react';
import { Banknote } from 'lucide-react';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';
import type { Contribution } from '@/types';

interface ContributionTimelineProps {
  contributions: Contribution[];
}

export function ContributionTimeline({ contributions }: ContributionTimelineProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Contribution History
      </h3>

      {contributions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Banknote className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No contributions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((contribution, index) => (
            <div key={contribution.id} className="relative">
              {/* Timeline line */}
              {index !== contributions.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold z-10">
                  {getInitials(
                    contribution.user.firstName,
                    contribution.user.lastName
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {contribution.user.firstName} {contribution.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(contribution.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        +{formatCurrency(contribution.amount)}
                      </p>
                    </div>
                  </div>
                  {contribution.note && (
                    <p className="mt-2 text-sm text-gray-600">
                      &quot;{contribution.note}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
