import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL, ROUTES } from './constants';
import type {
  User,
  Group,
  Contribution,
  Notification,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreateGroupData,
  ContributionData,
  DashboardStats,
  Activity,
} from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyOTP: async (userId: string, code: string): Promise<void> => {
    await api.post('/auth/verify-otp', { userId, code });
  },

  resendOTP: async (userId: string): Promise<void> => {
    await api.post('/auth/resend-otp', { userId });
  },

  completeTutorial: async (): Promise<void> => {
    await api.post('/auth/complete-tutorial');
  },
};

// Groups API
export const groupsApi = {
  getAll: async (myGroupsOnly = false): Promise<Group[]> => {
    const params = myGroupsOnly ? '?myGroups=true' : '';
    const response = await api.get<{ success: boolean; data: Group[] }>(`/groups${params}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Group> => {
    const response = await api.get<{ success: boolean; data: Group }>(`/groups/${id}`);
    return response.data.data;
  },

  create: async (data: CreateGroupData): Promise<Group> => {
    const response = await api.post<{ success: boolean; data: Group }>('/groups', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateGroupData>): Promise<Group> => {
    const response = await api.put<{ success: boolean; data: Group }>(`/groups/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },

  join: async (id: string): Promise<void> => {
    await api.post(`/groups/${id}/join`);
  },

  leave: async (id: string): Promise<void> => {
    await api.post(`/groups/${id}/leave`);
  },
};

// Contributions API
export const contributionsApi = {
  getAll: async (): Promise<Contribution[]> => {
    const response = await api.get<{ success: boolean; data: Contribution[] }>('/contributions');
    return response.data.data;
  },

  getByGroup: async (groupId: string): Promise<Contribution[]> => {
    const response = await api.get<{ success: boolean; data: Contribution[] }>(`/contributions/group/${groupId}`);
    return response.data.data;
  },

  create: async (groupId: string, data: ContributionData): Promise<Contribution> => {
    const response = await api.post<{ success: boolean; data: Contribution }>(`/contributions/group/${groupId}`, data);
    return response.data.data;
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<{ success: boolean; data: Notification[] }>('/notifications');
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    return response.data.data;
  },

  getActivities: async (): Promise<Activity[]> => {
    const response = await api.get<{ success: boolean; data: Activity[] }>('/dashboard/activities');
    return response.data.data;
  },
};

export default api;
