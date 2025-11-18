export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Goalsaver';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  CREATE_GROUP: '/groups/create',
  GROUP_DETAIL: (id: string) => `/groups/${id}`,
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
};

export const GROUP_STATUS = {
  SAVING: 'SAVING',
  TARGET_REACHED: 'TARGET_REACHED',
  PROCESSING_PURCHASE: 'PROCESSING_PURCHASE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const GROUP_STATUS_LABELS = {
  [GROUP_STATUS.SAVING]: 'Saving',
  [GROUP_STATUS.TARGET_REACHED]: 'Target Reached',
  [GROUP_STATUS.PROCESSING_PURCHASE]: 'Processing',
  [GROUP_STATUS.COMPLETED]: 'Completed',
  [GROUP_STATUS.CANCELLED]: 'Cancelled',
};

export const GROUP_STATUS_COLORS = {
  [GROUP_STATUS.SAVING]: 'bg-blue-100 text-blue-800',
  [GROUP_STATUS.TARGET_REACHED]: 'bg-green-100 text-green-800',
  [GROUP_STATUS.PROCESSING_PURCHASE]: 'bg-yellow-100 text-yellow-800',
  [GROUP_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800',
  [GROUP_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
};

export const NOTIFICATION_TYPES = {
  CONTRIBUTION: 'contribution',
  GROUP_JOINED: 'group_joined',
  TARGET_REACHED: 'target_reached',
  PURCHASE_COMPLETED: 'purchase_completed',
  DEADLINE_APPROACHING: 'deadline_approaching',
} as const;

export const PROGRESS_MILESTONES = [25, 50, 75, 100];

export const PASSWORD_MIN_LENGTH = 8;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
