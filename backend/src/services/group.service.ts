import { prisma } from '../config/database';
import { CreateGroupInput, UpdateGroupInput } from '../types';
import { AppError } from '../middleware/errorHandler';
import { NotificationService } from './notification.service';
import { sendEmail, emailTemplates } from '../utils/email';

const notificationService = new NotificationService();

export class GroupService {
  async createGroup(userId: string, input: CreateGroupInput) {
    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        targetAmount: input.targetAmount,
        targetItem: input.targetItem,
        deadline: input.deadline,
        isPublic: input.isPublic,
        createdById: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return group;
  }

  async getGroups(userId?: string, isPublic?: boolean) {
    interface WhereClause {
      isPublic?: boolean;
      members?: {
        some: {
          userId: string;
        };
      };
    }
    
    const where: WhereClause = {};

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (userId) {
      where.members = {
        some: {
          userId,
        },
      };
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            contributions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return groups;
  }

  async getGroupById(groupId: string) {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        contributions: {
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
        },
        _count: {
          select: {
            members: true,
            contributions: true,
          },
        },
      },
    });

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    return group;
  }

  async updateGroup(groupId: string, userId: string, input: UpdateGroupInput) {
    // Check if user is admin
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!member || member.role !== 'ADMIN') {
      throw new AppError(403, 'Only group admins can update the group');
    }

    const group = await prisma.group.update({
      where: { id: groupId },
      data: input,
    });

    return group;
  }

  async deleteGroup(groupId: string, userId: string) {
    // Check if user is admin
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!member || member.role !== 'ADMIN') {
      throw new AppError(403, 'Only group admins can delete the group');
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    return { message: 'Group deleted successfully' };
  }

  async joinGroup(groupId: string, userId: string) {
    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
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

    // Check if group is accepting members
    if (group.status !== 'SAVING') {
      throw new AppError(400, 'Group is not accepting new members');
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (existingMember) {
      throw new AppError(400, 'You are already a member of this group');
    }

    // Add user to group
    const member = await prisma.groupMember.create({
      data: {
        userId,
        groupId,
      },
      include: {
        user: true,
        group: true,
      },
    });

    // Get the new member's details
    const newMember = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (newMember) {
      // Send notification to new member
      await notificationService.createNotification({
        userId: newMember.id,
        title: 'Joined Group',
        message: `You joined "${group.name}"`,
        type: 'GROUP_JOINED',
      });

      // Send email to new member
      const joinEmail = emailTemplates.groupJoined(newMember.firstName, group.name);
      await sendEmail({
        to: newMember.email,
        subject: joinEmail.subject,
        text: joinEmail.text,
        html: joinEmail.html,
      });

      // Notify all existing members
      for (const existingMember of group.members) {
        await notificationService.createNotification({
          userId: existingMember.user.id,
          title: 'New Member',
          message: `${newMember.firstName} ${newMember.lastName} joined "${group.name}"`,
          type: 'GROUP_JOINED',
        });

        // Send email to existing members
        const memberEmail = emailTemplates.newMemberJoined(
          existingMember.user.firstName,
          group.name,
          `${newMember.firstName} ${newMember.lastName}`
        );
        await sendEmail({
          to: existingMember.user.email,
          subject: memberEmail.subject,
          text: memberEmail.text,
          html: memberEmail.html,
        });
      }
    }

    return member;
  }

  async leaveGroup(groupId: string, userId: string) {
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!member) {
      throw new AppError(404, 'You are not a member of this group');
    }

    if (member.role === 'ADMIN') {
      // Check if there are other members
      const memberCount = await prisma.groupMember.count({
        where: { groupId },
      });

      if (memberCount > 1) {
        throw new AppError(400, 'Admin cannot leave group with other members. Transfer admin role first or delete the group.');
      }
    }

    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return { message: 'Left group successfully' };
  }

  async getGroupMembers(groupId: string) {
    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return members;
  }
}
