import { Router } from 'express';
import { ContributionController } from '../controllers/contribution.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createContributionSchema } from '../utils/validators';

const router = Router();
const contributionController = new ContributionController();

/**
 * @route   POST /api/contributions
 * @desc    Add a contribution to a group
 * @access  Private
 */
router.post('/', authenticate, validate(createContributionSchema), contributionController.createContribution.bind(contributionController));

/**
 * @route   GET /api/contributions/group/:groupId
 * @desc    Get all contributions for a group
 * @access  Private
 */
router.get('/group/:groupId', authenticate, contributionController.getGroupContributions.bind(contributionController));

/**
 * @route   GET /api/contributions/user/:userId
 * @desc    Get user's contribution history
 * @access  Private
 */
router.get('/user/:userId', authenticate, contributionController.getUserContributions.bind(contributionController));

/**
 * @route   GET /api/contributions/:id
 * @desc    Get contribution details
 * @access  Private
 */
router.get('/:id', authenticate, contributionController.getContributionById.bind(contributionController));

export default router;
