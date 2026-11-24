export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export type HealthStatus = 'Fit' | 'Not Fit';

export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Donor {
  id: string;
  userId?: string;
  name: string;
  age: number;
  bloodType: BloodType;
  gender: Gender;
  healthStatus: HealthStatus;
  city: string;
  phone: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface BloodRequest {
  id: string;
  userId: string;
  userName: string;
  bloodType: BloodType;
  quantity: number;
  city: string;
  urgency: 'Low' | 'Medium' | 'High';
  reason: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}