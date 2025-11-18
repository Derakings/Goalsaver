import { prisma } from '../config/database';
import { CreateContributionInput } from '../types';
import { AppError } from '../middleware/errorHandler';
import { NotificationService } from './notification.service';
import { PurchaseService } from './purchase.service';
import { sendEmail, emailTemplates } from '../utils/email';

const notificationService = new NotificationService();
const purchaseService = new PurchaseService();

export class ContributionService {
  async createContribution(userId: string, input: CreateContributionInput) {
    // Check if user is a member of the group
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: input.groupId,
        },
      },
    });

    if (!member) {
      throw new AppError(403, 'You must be a member of the group to contribute');
    }

    // Check if group is in SAVING status
    const group = await prisma.group.findUnique({
      where: { id: input.groupId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    if (group.status !== 'SAVING') {
      throw new AppError(400, 'Group is not accepting contributions');
    }

    // Create contribution and update group amount in a transaction
    const contribution = await prisma.$transaction(async (tx) => {
      const contrib = await tx.contribution.create({
        data: {
          amount: input.amount,
          userId,
          groupId: input.groupId,
          note: input.note,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          group: true,
        },
      });

      // Update group's current amount
      const updatedGroup = await tx.group.update({
        where: { id: input.groupId },
        data: {
          currentAmount: {
            increment: input.amount,
          },
        },
      });

      return { contribution: contrib, group: updatedGroup };
    });

    const contributor = contribution.contribution.user;
    const updatedGroup = contribution.group;

    // Notify all group members about the contribution
    for (const groupMember of group.members) {
      await notificationService.createNotification({
        userId: groupMember.user.id,
        title: 'New Contribution',
        message: `${contributor.firstName} ${contributor.lastName} contributed $${input.amount} to "${group.name}"`,
        type: 'CONTRIBUTION_MADE',
      });

      // Send email notification
      const contributionEmail = emailTemplates.contributionMade(
        groupMember.user.firstName,
        group.name,
        `$${input.amount}`,
        `${contributor.firstName} ${contributor.lastName}`
      );
      await sendEmail({
        to: groupMember.user.email,
        subject: contributionEmail.subject,
        text: contributionEmail.text,
        html: contributionEmail.html,
      });
    }

    // Check for milestones
    const percentage = (Number(updatedGroup.currentAmount) / Number(updatedGroup.targetAmount)) * 100;
    const milestones = [25, 50, 75];

    for (const milestone of milestones) {
      const previousPercentage = (Number(updatedGroup.currentAmount) - input.amount) / Number(updatedGroup.targetAmount) * 100;
      
      if (previousPercentage < milestone && percentage >= milestone) {
        // Milestone reached, notify all members
        for (const groupMember of group.members) {
          await notificationService.createNotification({
            userId: groupMember.user.id,
            title: `${milestone}% Milestone Reached`,
            message: `"${group.name}" has reached ${milestone}% of its target goal!`,
            type: 'TARGET_MILESTONE',
          });

          // Send milestone email
          const milestoneEmail = emailTemplates.targetMilestone(
            groupMember.user.firstName,
            group.name,
            milestone
          );
          await sendEmail({
            to: groupMember.user.email,
            subject: milestoneEmail.subject,
            text: milestoneEmail.text,
            html: milestoneEmail.html,
          });
        }
      }
    }

    // Check if target is reached
    if (Number(updatedGroup.currentAmount) >= Number(updatedGroup.targetAmount)) {
      // Target reached, initiate purchase
      await purchaseService.initiatePurchase(input.groupId);
    }

    return contribution.contribution;
  }

  async getGroupContributions(groupId: string) {
    const contributions = await prisma.contribution.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contributions;
  }

  async getUserContributions(userId: string) {
    const contributions = await prisma.contribution.findMany({
      where: { userId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            targetItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contributions;
  }

  async getContributionById(contributionId: string) {
    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
            targetItem: true,
            targetAmount: true,
            currentAmount: true,
          },
        },
      },
    });

    if (!contribution) {
      throw new AppError(404, 'Contribution not found');
    }

    return contribution;
  }
}
