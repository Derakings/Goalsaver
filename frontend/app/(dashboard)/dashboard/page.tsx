'use client';

import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Target, Trophy } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import type { DashboardStats, Activity } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getActivities(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data for demo
        setStats({
          totalGroups: 0,
          totalContributed: 0,
          activeGoals: 0,
          completedGoals: 0,
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s an overview of your savings progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Groups"
          value={stats?.totalGroups || 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Contributed"
          value={formatCurrency(stats?.totalContributed || 0)}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Active Goals"
          value={stats?.activeGoals || 0}
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="Completed Goals"
          value={stats?.completedGoals || 0}
          icon={Trophy}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
