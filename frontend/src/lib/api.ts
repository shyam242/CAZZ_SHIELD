import axios from 'axios';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';
const API_BASE_URL = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, '').replace(/\/api\/v1$/, '') + '/api/v1'
  : '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cazz_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('cazz_token');
      localStorage.removeItem('cazz_token');
      localStorage.removeItem('cazz_refresh_token');
      localStorage.removeItem('cazz_user');

      // Only force a redirect if we weren't already on the login page.
      // Avoids redirect loops when the login request itself 401s.
      if (hadToken && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);
