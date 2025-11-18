import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { NotificationService } from './notification.service';
import { sendEmail, emailTemplates } from '../utils/email';
import { logger } from '../utils/logger';

const notificationService = new NotificationService();

export class PurchaseService {
  async initiatePurchase(groupId: string) {
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

    if (group.status !== 'SAVING') {
      throw new AppError(400, 'Group is not in SAVING status');
    }

    if (Number(group.currentAmount) < Number(group.targetAmount)) {
      throw new AppError(400, 'Target amount not yet reached');
    }

    // Update group status and create purchase record in a transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Update group status to TARGET_REACHED first
      await tx.group.update({
        where: { id: groupId },
        data: { status: 'TARGET_REACHED' },
      });

      // Notify all members that target is reached
      for (const member of group.members) {
        await notificationService.createNotification({
          userId: member.user.id,
          title: 'Target Reached!',
          message: `"${group.name}" has reached its target goal!`,
          type: 'TARGET_REACHED',
        });

        // Send email
        const targetEmail = emailTemplates.targetReached(
          member.user.firstName,
          group.name
        );
        await sendEmail({
          to: member.user.email,
          subject: targetEmail.subject,
          text: targetEmail.text,
          html: targetEmail.html,
        });
      }

      // Create purchase record
      const newPurchase = await tx.purchase.create({
        data: {
          groupId,
          totalAmount: group.currentAmount,
          status: 'PENDING',
          purchaseDetails: {
            targetItem: group.targetItem,
            initiatedBy: 'system',
          },
        },
      });

      // Update group status to PROCESSING_PURCHASE
      await tx.group.update({
        where: { id: groupId },
        data: { status: 'PROCESSING_PURCHASE' },
      });

      return newPurchase;
    });

    // Notify all members that purchase is initiated
    for (const member of group.members) {
      await notificationService.createNotification({
        userId: member.user.id,
        title: 'Purchase Initiated',
        message: `Purchase process has been initiated for "${group.name}"`,
        type: 'PURCHASE_INITIATED',
      });

      // Send email
      const purchaseEmail = emailTemplates.purchaseInitiated(
        member.user.firstName,
        group.name
      );
      await sendEmail({
        to: member.user.email,
        subject: purchaseEmail.subject,
        text: purchaseEmail.text,
        html: purchaseEmail.html,
      });
    }

    logger.info(`Purchase initiated for group ${groupId}`);

    return purchase;
  }

  async getPurchaseStatus(groupId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: { groupId },
      orderBy: { initiatedAt: 'desc' },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            targetItem: true,
            status: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new AppError(404, 'No purchase found for this group');
    }

    return purchase;
  }

  async completePurchase(purchaseId: string) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new AppError(404, 'Purchase not found');
    }

    if (purchase.status === 'COMPLETED') {
      throw new AppError(400, 'Purchase already completed');
    }

    // Update purchase and group status in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      await tx.group.update({
        where: { id: purchase.groupId },
        data: { status: 'COMPLETED' },
      });

      return updatedPurchase;
    });

    // Notify all members
    for (const member of purchase.group.members) {
      await notificationService.createNotification({
        userId: member.user.id,
        title: 'Purchase Completed!',
        message: `Purchase for "${purchase.group.name}" has been completed successfully!`,
        type: 'PURCHASE_COMPLETED',
      });

      // Send email
      const completedEmail = emailTemplates.purchaseCompleted(
        member.user.firstName,
        purchase.group.name
      );
      await sendEmail({
        to: member.user.email,
        subject: completedEmail.subject,
        text: completedEmail.text,
        html: completedEmail.html,
      });
    }

    logger.info(`Purchase ${purchaseId} completed for group ${purchase.groupId}`);

    return updated;
  }

  async getAllPurchases() {
    const purchases = await prisma.purchase.findMany({
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
        initiatedAt: 'desc',
      },
    });

    return purchases;
  }
}
