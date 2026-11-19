// src/app/services/donorService.ts
import { apiClient } from './api';
import { Donor } from '../types';

export interface CreateDonorData {
  userId: string;
  name: string;
  age: number;
  bloodType: Donor['bloodType'];
  gender: Donor['gender'];
  city: string;
  phone: string;
  healthStatus: Donor['healthStatus'];
  lastDonationDate?: string;
  isAvailable: boolean;
}

export const donorService = {
  async getAllDonors() {
    return await apiClient.get<Donor[]>('/donors');
  },

  async createDonor(data: CreateDonorData) {
    // Backend expects snake_case
    const payload = {
      user_id: data.userId,
      name: data.name,
      age: data.age,
      blood_type: data.bloodType,
      gender: data.gender,
      city: data.city,
      phone: data.phone,
      health_status: data.healthStatus,
      last_donation_date: data.lastDonationDate ?? null,
      is_available: data.isAvailable,
    };

    return await apiClient.post<Donor>('/donors', payload);
  },

  async deleteDonor(donorId: string) {
    return await apiClient.delete<{ success: boolean; message: string }>(`/donors/${donorId}`);
  },
};
