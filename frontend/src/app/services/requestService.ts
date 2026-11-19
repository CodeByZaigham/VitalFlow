import { apiClient } from './api';
import { BloodRequest } from '../types';

export interface CreateRequestData {
  bloodType: string;
  quantity: number;
  city: string;
  urgency: 'Low' | 'Medium' | 'High';
  reason: string;
  userId: string;
  userName: string;
}

export const requestService = {
  // GET /api/requests (admin)
  async getAllRequests() {
    return await apiClient.get<BloodRequest[]>('/requests');
  },

  // GET /api/requests/user/{user_id} (customer)
  async getRequestsByUser(userId: string) {
    return await apiClient.get<BloodRequest[]>(`/requests/user/${userId}`);
  },

  // POST /api/requests (customer)
  async createRequest(data: CreateRequestData) {
    // Backend expects snake_case
    const payload = {
      user_id: data.userId,
      user_name: data.userName,
      blood_type: data.bloodType,
      quantity: data.quantity,
      city: data.city,
      urgency: data.urgency,
      reason: data.reason,
    };
    return await apiClient.post<BloodRequest>('/requests', payload);
  },

  // PUT /api/requests/{id}/status (admin)
  async updateRequestStatus(requestId: string, status: BloodRequest['status']) {
    return await apiClient.put<BloodRequest>(`/requests/${requestId}/status`, { status });
  },

  // DELETE /api/requests/{id} (admin)
  async deleteRequest(requestId: string) {
    return await apiClient.delete(`/requests/${requestId}`);
  },
};
