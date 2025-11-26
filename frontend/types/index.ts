// types/index.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  hasCompletedTutorial?: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetItem: string;
  deadline?: string;
  status: 'SAVING' | 'TARGET_REACHED' | 'PROCESSING_PURCHASE' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  createdById: string;
  members: GroupMember[];
  createdAt: string;
  imageUrl?: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  user: User;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface Contribution {
  id: string;
  amount: number;
  userId: string;
  user: User;
  groupId: string;
  note?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  targetAmount: number;
  targetItem: string;
  deadline?: string;
  isPublic: boolean;
  imageUrl?: string;
}

export interface ContributionData {
  amount: number;
  note?: string;
}

export interface DashboardStats {
  totalGroups: number;
  totalContributed: number;
  activeGoals: number;
  completedGoals: number;
}

export interface Activity {
  id: string;
  type: 'contribution' | 'group_joined' | 'target_reached' | 'purchase_completed';
  message: string;
  timestamp: string;
  groupId?: string;
}
