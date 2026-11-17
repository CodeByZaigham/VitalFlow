import { apiClient } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  // POST /api/auth/login
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<any>('/auth/login', credentials);
    const token =
    response.data?.access_token ||
    response.data?.token ||
    response.data?.accessToken ||
    response.data?.data?.access_token ||
    response.data?.data?.token ||
    response.data?.data?.accessToken;
    if (!token) {
    // IMPORTANT: don't pretend login succeeded
    return { error: "Login succeeded but token was missing. Check login response shape.", data: response.data };
    }
    apiClient.setToken(token);
    return response;
  },

  // POST /api/auth/register
  async register(data: RegisterData) {
    return await apiClient.post<User>('/auth/register', data);
  },

  // GET /api/auth/me
  async getCurrentUser() {
    return await apiClient.get<User>('/auth/me');
  },

  // Logout (client-side)
  logout() {
    apiClient.clearToken();
  },
};
