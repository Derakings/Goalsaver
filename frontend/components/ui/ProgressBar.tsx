import React from 'react';
import { cn, getProgressBgColor } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  target,
  showPercentage = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const progressColor = getProgressBgColor(percentage);

  const heights = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out', progressColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
