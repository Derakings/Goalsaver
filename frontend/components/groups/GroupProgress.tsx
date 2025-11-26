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
  const circumference = 2 * Math.PI * 112;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700">
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Side - Progress Display */}
        <div className="flex flex-col items-center justify-center py-6 lg:w-2/5">
          <div className="relative w-full max-w-xs">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            
            {/* Trophy and Percentage */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-4 p-4">
              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 p-6 md:p-8 rounded-full backdrop-blur-sm">
                <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)]" />
              </div>
              <div>
                <p className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-none">
                  {percentage.toFixed(0)}%
                </p>
                <p className="text-base md:text-lg text-gray-400 mt-2 font-medium">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 space-y-4 md:space-y-6">
          
          {/* Target Item */}
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg p-4 md:p-6 border border-blue-700/50">
            <p className="text-xs md:text-sm text-gray-400 mb-2 flex items-center">
              <span className="mr-2">🎯</span>
              Target Item
            </p>
            <p className="text-xl md:text-2xl font-bold text-blue-300 break-words">{group.targetItem}</p>
          </div>

          {/* Current vs Target */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gray-800/60 rounded-lg p-3 md:p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1 md:mb-2">Current</p>
              <p className="text-lg md:text-xl font-bold text-green-400 break-words">
                {formatCurrency(group.currentAmount)}
              </p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3 md:p-4 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1 md:mb-2">Target</p>
              <p className="text-lg md:text-xl font-bold text-blue-400 break-words">
                {formatCurrency(group.targetAmount)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 md:h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs md:text-sm text-gray-400 text-center">
              <span className="font-bold text-purple-400">
                {formatCurrency(Math.max(group.targetAmount - group.currentAmount, 0))}
              </span>
              {' '}remaining
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
