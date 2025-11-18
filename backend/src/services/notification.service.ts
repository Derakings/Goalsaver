import { prisma } from '../config/database';
import { NotificationPayload } from '../types';
import { AppError } from '../middleware/errorHandler';

export class NotificationService {
  async createNotification(payload: NotificationPayload) {
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type as 
          'GROUP_JOINED' | 
          'CONTRIBUTION_MADE' | 
          'TARGET_MILESTONE' | 
          'TARGET_REACHED' | 
          'PURCHASE_INITIATED' | 
          'PURCHASE_COMPLETED',
      },
    });

    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    interface WhereClause {
      userId: string;
      isRead?: boolean;
    }
    
    const where: WhereClause = { userId };

    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }

    if (notification.userId !== userId) {
      throw new AppError(403, 'Not authorized to update this notification');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updated;
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { message: 'All notifications marked as read' };
  }
}
