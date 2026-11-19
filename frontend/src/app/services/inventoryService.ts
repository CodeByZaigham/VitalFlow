import { apiClient } from './api';
import { BloodInventory, BloodType } from '../types';

export interface UpdateInventoryData {
  quantity: number;
}

export const inventoryService = {
  // GET /api/inventory
  async getAllInventory() {
    return await apiClient.get<BloodInventory[]>('/inventory');
  },

  // GET /api/inventory/{blood_type}
  async getInventoryByType(bloodType: BloodType) {
    return await apiClient.get<BloodInventory>(`/inventory/${bloodType}`);
  },

  // PUT /api/inventory/{blood_type}
  async updateInventory(bloodType: BloodType, data: UpdateInventoryData) {
    return await apiClient.put<BloodInventory>(`/inventory/${bloodType}`, data);
  },

  // GET /api/inventory/stats
  async getInventoryStats() {
    return await apiClient.get<{
      totalQuantity: number;
      byBloodType: Record<BloodType, number>;
      lowStock: BloodType[];
    }>('/inventory/stats');
  },
};
