import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const purchaseController = new PurchaseController();

/**
 * @route   POST /api/purchases/initiate/:groupId
 * @desc    Initiate purchase for a group (auto-triggered when target is reached)
 * @access  Private
 */
router.post('/initiate/:groupId', authenticate, purchaseController.initiatePurchase.bind(purchaseController));

/**
 * @route   GET /api/purchases/:groupId
 * @desc    Get purchase status for a group
 * @access  Private
 */
router.get('/:groupId', authenticate, purchaseController.getPurchaseStatus.bind(purchaseController));

/**
 * @route   PUT /api/purchases/:id/complete
 * @desc    Mark purchase as completed
 * @access  Private
 */
router.put('/:id/complete', authenticate, purchaseController.completePurchase.bind(purchaseController));

/**
 * @route   GET /api/purchases
 * @desc    Get all purchases
 * @access  Private
 */
router.get('/', authenticate, purchaseController.getAllPurchases.bind(purchaseController));

export default router;
