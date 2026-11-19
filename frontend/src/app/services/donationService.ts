import { apiClient } from './api';
import { Donation, BloodType } from '../types';

export interface CreateDonationData {
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  quantity: number;
  donationDate: string;
}

export interface DonationFilters {
  donorId?: string;
  bloodType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const donationService = {
  // GET /api/donations
  async getAllDonations(filters?: DonationFilters) {
    const params = new URLSearchParams();
    if (filters?.donorId) params.append('donor_id', filters.donorId);
    if (filters?.bloodType) params.append('blood_type', filters.bloodType);
    if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters?.dateTo) params.append('date_to', filters.dateTo);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiClient.get<Donation[]>(`/donations${query}`);
  },

  // GET /api/donations/{donation_id}
  async getDonationById(donationId: string) {
    return await apiClient.get<Donation>(`/donations/${donationId}`);
  },

  // GET /api/donations/donor/{donor_id}
  async getDonorDonations(donorId: string) {
    return await apiClient.get<Donation[]>(`/donations/donor/${donorId}`);
  },

  // POST /api/donations
  async createDonation(data: CreateDonationData) {
    return await apiClient.post<Donation>('/donations', data);
  },

  // GET /api/donations/stats
  async getDonationStats() {
    return await apiClient.get<{
      totalDonations: number;
      totalQuantity: number;
      byBloodType: Record<BloodType, number>;
    }>('/donations/stats');
  },
};
