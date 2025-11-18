import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

// Group validators
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  targetAmount: z.number().positive('Target amount must be positive'),
  targetItem: z.string().min(1, 'Target item is required'),
  deadline: z.string().datetime().optional(),
  isPublic: z.boolean().default(false),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  targetAmount: z.number().positive().optional(),
  targetItem: z.string().min(1).optional(),
  deadline: z.string().datetime().optional(),
  isPublic: z.boolean().optional(),
});

// Contribution validators
export const createContributionSchema = z.object({
  amount: z.number().positive('Contribution amount must be positive'),
  groupId: z.string().uuid('Invalid group ID'),
  note: z.string().max(200).optional(),
});

// Generic UUID validator
export const uuidSchema = z.string().uuid('Invalid ID format');

// Pagination validators
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
