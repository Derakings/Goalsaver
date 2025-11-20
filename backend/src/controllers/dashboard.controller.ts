import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest, DashboardStats, Activity } from '../types';

export class DashboardController {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      // Get total groups the user is part of
      const totalGroups = await prisma.groupMember.count({
        where: { userId },
      });

      // Get active contributions count
      const activeContributions = await prisma.contribution.count({
        where: { userId },
      });

      // Get total amount saved
      const contributions = await prisma.contribution.findMany({
        where: { userId },
        select: { amount: true },
      });
      
      const totalSaved = contributions.reduce(
        (sum, contribution) => sum + Number(contribution.amount),
        0
      );

      // Get groups with upcoming deadlines (next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const upcomingDeadlines = await prisma.group.count({
        where: {
          members: {
            some: { userId },
          },
          deadline: {
            gte: new Date(),
            lte: sevenDaysFromNow,
          },
          status: 'SAVING',
        },
      });

      const stats: DashboardStats = {
        totalGroups,
        activeContributions,
        totalSaved,
        upcomingDeadlines,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivities(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const activities: Activity[] = [];

      // Get recent contributions
      const recentContributions = await prisma.contribution.findMany({
        where: { userId },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      for (const contribution of recentContributions) {
        activities.push({
          id: contribution.id,
          type: 'contribution',
          message: `You contributed $${contribution.amount} to ${contribution.group.name}`,
          timestamp: contribution.createdAt,
          groupId: contribution.groupId,
          groupName: contribution.group.name,
        });
      }

      // Get recently joined groups
      const recentGroupJoins = await prisma.groupMember.findMany({
        where: { userId },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { joinedAt: 'desc' },
        take: 10,
      });

      for (const member of recentGroupJoins) {
        activities.push({
          id: member.id,
          type: 'group_joined',
          message: `You joined ${member.group.name}`,
          timestamp: member.joinedAt,
          groupId: member.groupId,
          groupName: member.group.name,
        });
      }

      // Get groups that reached target (only those the user is a member of)
      const targetReachedGroups = await prisma.group.findMany({
        where: {
          members: {
            some: { userId },
          },
          status: 'TARGET_REACHED',
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      });

      for (const group of targetReachedGroups) {
        activities.push({
          id: group.id,
          type: 'target_reached',
          message: `${group.name} reached its target!`,
          timestamp: group.updatedAt,
          groupId: group.id,
          groupName: group.name,
        });
      }

      // Get completed purchases (only those the user's groups have completed)
      const completedPurchases = await prisma.purchase.findMany({
        where: {
          status: 'COMPLETED',
          group: {
            members: {
              some: { userId },
            },
          },
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: 10,
      });

      for (const purchase of completedPurchases) {
        if (purchase.completedAt) {
          activities.push({
            id: purchase.id,
            type: 'purchase_completed',
            message: `Purchase completed for ${purchase.group.name}`,
            timestamp: purchase.completedAt,
            groupId: purchase.groupId,
            groupName: purchase.group.name,
          });
        }
      }

      // Sort all activities by timestamp (most recent first) and limit to 10
      const sortedActivities = activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

      res.status(200).json({
        success: true,
        data: sortedActivities,
      });
    } catch (error) {
      next(error);
    }
  }
}
