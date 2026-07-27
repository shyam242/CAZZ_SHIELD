import { create } from 'zustand';
import { authApi, User } from '../lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedToken = localStorage.getItem('cazz_token');
  const savedUserRaw = localStorage.getItem('cazz_user');
  const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;

  return {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken && !!savedUser,
    loading: false,
    error: null,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await authApi.login({ email, password });
        localStorage.setItem('cazz_token', response.access_token);
        localStorage.setItem('cazz_refresh_token', response.refresh_token);
        localStorage.setItem('cazz_user', JSON.stringify(response.user));
        set({ 
          token: response.access_token, 
          user: response.user, 
          isAuthenticated: true, 
          loading: false 
        });
      } catch (error) {
        set({ error: 'Login failed', loading: false });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('cazz_token');
      localStorage.removeItem('cazz_refresh_token');
      localStorage.removeItem('cazz_user');
      set({ token: null, user: null, isAuthenticated: false });
    },

    fetchUser: async () => {
      const token = localStorage.getItem('cazz_token');
      if (!token) return;
      
      set({ loading: true, error: null });
      try {
        const user = await authApi.getMe();
        localStorage.setItem('cazz_user', JSON.stringify(user));
        set({ user, loading: false });
      } catch (error) {
        set({ error: 'Failed to fetch user', loading: false });
      }
    },

    hasRole: (roles) => {
      const { user } = get();
      if (!user) return false;
      if (user.role === 'admin') return true;
      return roles.includes(user.role);
    },
  };
});
