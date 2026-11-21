import { BloodType } from '../types';

// Blood compatibility data (static reference data)
export const bloodCompatibility = {
  canDonateTo: {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  canReceiveFrom: {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  }
};

// Donation facts (static educational content)
export const donationFacts = [
  'One blood donation can save up to three lives.',
  'Blood cannot be manufactured – it can only come from donors.',
  'Every 2 seconds, someone in the world needs blood.',
  'Only 10% of eligible donors donate blood annually.',
  'The entire process of donating blood takes about 10-12 minutes.',
  'Your body replaces the donated blood within 24-48 hours.',
  'Type O- blood is the universal donor and can be given to anyone.',
  'Type AB+ blood is the universal recipient and can receive any blood type.',
  'Healthy adults can donate blood every 56 days (8 weeks).',
  'One unit of blood can help patients with cancer, trauma, or undergoing surgery.'
];

// Helper function to check donor eligibility
export const checkDonorEligibility = (
  age: number,
  healthStatus: string,
  lastDonationDate?: string
): { eligible: boolean; reason?: string } => {
  if (age < 18) {
    return { eligible: false, reason: 'You must be at least 18 years old to donate blood' };
  }

  if (healthStatus !== 'Fit') {
    return { eligible: false, reason: 'Only individuals with Fit health status can become donors' };
  }

  if (lastDonationDate) {
    const lastDonation = new Date(lastDonationDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (lastDonation > threeMonthsAgo) {
      return { eligible: false, reason: 'Last donation must be at least 3 months ago' };
    }
  }

  return { eligible: true };
};

// Helper function to validate blood request
export const validateBloodRequest = (
  requestedQuantity: number,
  availableQuantity: number
): { valid: boolean; message?: string } => {
  if (requestedQuantity <= 0) {
    return { valid: false, message: 'Quantity must be greater than 0' };
  }

  if (availableQuantity < requestedQuantity) {
    return { valid: false, message: 'Insufficient blood stock' };
  }

  return { valid: true };
};
