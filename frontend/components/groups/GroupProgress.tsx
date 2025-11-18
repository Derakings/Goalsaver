'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { formatCurrency, calculateProgress, getProgressColor } from '@/lib/utils';
import type { Group } from '@/types';

interface GroupProgressProps {
  group: Group;
}

export function GroupProgress({ group }: GroupProgressProps) {
  const percentage = calculateProgress(group.currentAmount, group.targetAmount);
  const progressColor = getProgressColor(percentage);

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {/* Circular Progress */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg className="transform -rotate-90 w-64 h-64">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="16"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="currentColor"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - percentage / 100)}`}
              className={`transition-all duration-1000 ease-out ${progressColor}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <Trophy className={`w-12 h-12 mb-2 mx-auto ${progressColor}`} />
              <p className="text-4xl font-bold text-gray-900">
                {percentage.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Complete</p>
            </div>
          </div>
        </div>

        {/* Amount Details */}
        <div className="mt-8 text-center w-full">
          <div className="flex items-center justify-center space-x-4">
            <div>
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(group.currentAmount)}
              </p>
            </div>
            <div className="text-gray-400">/</div>
            <div>
              <p className="text-sm text-gray-600">Target</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(group.targetAmount)}
              </p>
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="mt-4">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">
                {formatCurrency(group.targetAmount - group.currentAmount)}
              </span>
              {' '}remaining to reach goal
            </p>
          </div>

          {/* Target Item */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Target Item</p>
            <p className="text-lg font-semibold text-blue-900">{group.targetItem}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
