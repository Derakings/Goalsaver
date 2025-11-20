import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics for the user
 * @access  Private
 */
router.get('/stats', authenticate, dashboardController.getStats.bind(dashboardController));

/**
 * @route   GET /api/dashboard/activities
 * @desc    Get recent activities for the user
 * @access  Private
 */
router.get('/activities', authenticate, dashboardController.getActivities.bind(dashboardController));

export default router;
