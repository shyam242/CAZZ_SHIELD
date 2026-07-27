import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  title: string;
  avatar_url: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  last_login: string | null;
  created_at: string;
}

export const authApi = {
  login: async (request: LoginRequest) => {
    const response = await api.post<LoginResponse>('/auth/login', request);
    return response.data;
  },

  refresh: async (request: RefreshRequest) => {
    const response = await api.post<RefreshResponse>('/auth/refresh', request);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};
