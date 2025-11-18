import { Request, Response, NextFunction } from 'express';
import { PurchaseService } from '../services/purchase.service';

const purchaseService = new PurchaseService();

export class PurchaseController {
  async initiatePurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = await purchaseService.initiatePurchase(req.params.groupId);
      res.status(201).json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPurchaseStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = await purchaseService.getPurchaseStatus(req.params.groupId);
      res.status(200).json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async completePurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = await purchaseService.completePurchase(req.params.id);
      res.status(200).json({
        success: true,
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPurchases(_req: Request, res: Response, next: NextFunction) {
    try {
      const purchases = await purchaseService.getAllPurchases();
      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }
}
