import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/group.service';
import { AuthRequest } from '../types';

const groupService = new GroupService();

export class GroupController {
  async createGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const group = await groupService.createGroup(userId, req.body);
      res.status(201).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.query.myGroups === 'true' ? req.user!.id : undefined;
      const isPublic = req.query.public === 'true' ? true : undefined;
      
      const groups = await groupService.getGroups(userId, isPublic);
      res.status(200).json({
        success: true,
        data: groups,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.getGroupById(req.params.id);
      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const group = await groupService.updateGroup(req.params.id, userId, req.body);
      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await groupService.deleteGroup(req.params.id, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async joinGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const member = await groupService.joinGroup(req.params.id, userId);
      res.status(200).json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  async leaveGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await groupService.leaveGroup(req.params.id, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await groupService.getGroupMembers(req.params.id);
      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }
}
