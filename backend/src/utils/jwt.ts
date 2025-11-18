import jwt from 'jsonwebtoken';
import { config } from '../config/database';

interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
