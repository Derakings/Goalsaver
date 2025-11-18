import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createGroupSchema, updateGroupSchema } from '../utils/validators';

const router = Router();
const groupController = new GroupController();

/**
 * @route   POST /api/groups
 * @desc    Create a new group
 * @access  Private
 */
router.post('/', authenticate, validate(createGroupSchema), groupController.createGroup.bind(groupController));

/**
 * @route   GET /api/groups
 * @desc    Get all groups (with optional filters)
 * @access  Private
 */
router.get('/', authenticate, groupController.getGroups.bind(groupController));

/**
 * @route   GET /api/groups/:id
 * @desc    Get group by ID
 * @access  Private
 */
router.get('/:id', authenticate, groupController.getGroupById.bind(groupController));

/**
 * @route   PUT /api/groups/:id
 * @desc    Update group (admin only)
 * @access  Private
 */
router.put('/:id', authenticate, validate(updateGroupSchema), groupController.updateGroup.bind(groupController));

/**
 * @route   DELETE /api/groups/:id
 * @desc    Delete group (admin only)
 * @access  Private
 */
router.delete('/:id', authenticate, groupController.deleteGroup.bind(groupController));

/**
 * @route   POST /api/groups/:id/join
 * @desc    Join a group
 * @access  Private
 */
router.post('/:id/join', authenticate, groupController.joinGroup.bind(groupController));

/**
 * @route   POST /api/groups/:id/leave
 * @desc    Leave a group
 * @access  Private
 */
router.post('/:id/leave', authenticate, groupController.leaveGroup.bind(groupController));

/**
 * @route   GET /api/groups/:id/members
 * @desc    Get group members
 * @access  Private
 */
router.get('/:id/members', authenticate, groupController.getGroupMembers.bind(groupController));

export default router;
