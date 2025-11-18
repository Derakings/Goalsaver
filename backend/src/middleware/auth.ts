import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
