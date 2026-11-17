// src/app/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

async function safeReadJson(response: Response): Promise<any | null> {
  // 204 No Content OR empty body
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<ApiResponse<T>> {
    try {
      const config: RequestInit = {
        method,
        headers: this.getHeaders(),
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await safeReadJson(response);

      if (!response.ok) {
        return { error: data?.detail || data?.message || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, 'GET');
  }
  post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, 'POST', body);
  }
  put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, 'PUT', body);
  }
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, 'DELETE');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
