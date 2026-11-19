import { apiClient } from './api';
import { User } from '../types';

export const userService = {
  // GET /api/users (Admin only)
  async getAllUsers() {
    return await apiClient.get<User[]>('/users');
  },

  // GET /api/users/{user_id}
  async getUserById(userId: string) {
    return await apiClient.get<User>(`/users/${userId}`);
  },

  // PUT /api/users/{user_id}
  async updateUser(userId: string, data: Partial<User>) {
    return await apiClient.put<User>(`/users/${userId}`, data);
  },

  // DELETE /api/users/{user_id} (Admin only)
  async deleteUser(userId: string) {
    return await apiClient.delete(`/users/${userId}`);
  },
};
