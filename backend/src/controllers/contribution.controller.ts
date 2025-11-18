import { Request, Response, NextFunction } from 'express';
import { ContributionService } from '../services/contribution.service';
import { AuthRequest } from '../types';

const contributionService = new ContributionService();

export class ContributionController {
  async createContribution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const contribution = await contributionService.createContribution(userId, req.body);
      res.status(201).json({
        success: true,
        data: contribution,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupContributions(req: Request, res: Response, next: NextFunction) {
    try {
      const contributions = await contributionService.getGroupContributions(req.params.groupId);
      res.status(200).json({
        success: true,
        data: contributions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserContributions(req: Request, res: Response, next: NextFunction) {
    try {
      const contributions = await contributionService.getUserContributions(req.params.userId);
      res.status(200).json({
        success: true,
        data: contributions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getContributionById(req: Request, res: Response, next: NextFunction) {
    try {
      const contribution = await contributionService.getContributionById(req.params.id);
      res.status(200).json({
        success: true,
        data: contribution,
      });
    } catch (error) {
      next(error);
    }
  }
}
