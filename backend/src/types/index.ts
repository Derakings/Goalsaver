import { Request } from 'express';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

// Group types
export interface CreateGroupInput {
  name: string;
  description: string;
  targetAmount: number;
  targetItem: string;
  deadline?: Date;
  isPublic: boolean;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
  targetAmount?: number;
  targetItem?: string;
  deadline?: Date;
  isPublic?: boolean;
}

// Contribution types
export interface CreateContributionInput {
  amount: number;
  groupId: string;
  note?: string;
}

// Notification types
export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
}

// Email types
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}
