import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types';

const notificationService = new NotificationService();

export class NotificationController {
  async getUserNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await notificationService.getUserNotifications(userId, unreadOnly);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notification = await notificationService.markAsRead(req.params.id, userId);
      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await notificationService.markAllAsRead(userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
