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