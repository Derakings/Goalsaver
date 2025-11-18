import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', authenticate, notificationController.getUserNotifications.bind(notificationController));

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));

export default router;
