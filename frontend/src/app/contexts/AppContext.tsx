// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Donor, BloodRequest, BloodInventory, Donation } from '../types';
import { authService } from '../services/authService';
import { donorService } from '../services/donorService';
import { requestService } from '../services/requestService';
import { donationService } from '../services/donationService';
import { inventoryService } from '../services/inventoryService';
import { userService } from '../services/userService';
import { toast } from 'sonner';

type ActionResult = { success: true; message?: string } | { success: false; error: string };

interface AppContextType {
  currentUser: User | null;
  users: User[];
  donors: Donor[];
  requests: BloodRequest[];
  inventory: BloodInventory[];
  donations: Donation[];
  loading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;

  addDonor: (donor: Omit<Donor, 'id' | 'createdAt'>) => Promise<ActionResult>;
  removeDonor: (donorId: string) => Promise<ActionResult>;

  addRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<ActionResult>;
  updateRequestStatus: (requestId: string, status: 'Approved' | 'Rejected') => Promise<ActionResult>;

  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => Promise<ActionResult>;
  deleteUser: (userId: string) => Promise<ActionResult>;

  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      const response = await authService.getCurrentUser();
      if (response.data) {
        setCurrentUser(response.data);
        await loadAllData(response.data);
      } else {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async (user: User) => {
    try {
      const donorsResponse = await donorService.getAllDonors();
      if (donorsResponse.data) setDonors(donorsResponse.data);

      const inventoryResponse = await inventoryService.getAllInventory();
      if (inventoryResponse.data) setInventory(inventoryResponse.data);

      if (user.role === 'admin') {
        const requestsResponse = await requestService.getAllRequests();
        if (requestsResponse.data) setRequests(requestsResponse.data);

        const donationsResponse = await donationService.getAllDonations();
        if (donationsResponse.data) setDonations(donationsResponse.data);

        const usersResponse = await userService.getAllUsers();
        if (usersResponse.data) setUsers(usersResponse.data);
      } else {
        const userRequestsResponse = await requestService.getRequestsByUser(user.id);
        if (userRequestsResponse.data) setRequests(userRequestsResponse.data);
      }
    } catch (e) {
      // no toast here (prevents “success + error”)
      console.error('loadAllData error:', e);
    }
  };

  const refreshData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await loadAllData(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const response = await authService.login({ email, password });
    setLoading(false);

    if (response.data) {
      setCurrentUser(response.data.user);
      await refreshData();
      return true;
    }

    toast.error(response.error || 'Login failed');
    return false;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setUsers([]);
    setDonors([]);
    setRequests([]);
    setInventory([]);
    setDonations([]);
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    const response = await authService.register({ email, password, name });
    setLoading(false);

    if (response.data) return true;
    toast.error(response.error || 'Registration failed');
    return false;
  };

  const addDonor = async (donor: Omit<Donor, 'id' | 'createdAt'>): Promise<ActionResult> => {
    if (!donor.userId) return { success: false, error: 'Please login first' };

    setLoading(true);
    try {
      const response = await donorService.createDonor({
        userId: donor.userId,
        name: donor.name,
        age: donor.age,
        bloodType: donor.bloodType,
        gender: donor.gender,
        city: donor.city,
        phone: donor.phone,
        healthStatus: donor.healthStatus,
        lastDonationDate: donor.lastDonationDate,
        isAvailable: donor.isAvailable,
      });

      if (!response.data) return { success: false, error: response.error || 'Failed to add donor' };

      await refreshData();
      return { success: true, message: 'Registered as donor' };
    } finally {
      setLoading(false);
    }
  };

  const removeDonor = async (donorId: string): Promise<ActionResult> => {
    setLoading(true);
    try {
      const response = await donorService.deleteDonor(donorId);
      if (response.error) return { success: false, error: response.error || 'Failed to remove donor' };
      await refreshData();
      return { success: true, message: 'Donor deleted' };
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (request: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ActionResult> => {
    if (!request.userId) return { success: false, error: 'Please login first' };

    setLoading(true);
    try {
      const response = await requestService.createRequest({
        userId: request.userId,
        userName: request.userName,
        bloodType: request.bloodType,
        quantity: request.quantity,
        city: request.city,
        urgency: request.urgency,
        reason: request.reason,
      });

      if (!response.data) return { success: false, error: response.error || 'Failed to create request' };

      await refreshData();
      return { success: true, message: 'Request created' };
    } finally {
      setLoading(false);
    }
  };

 const updateRequestStatus = async (
  requestId: string,
  status: 'Approved' | 'Rejected'
): Promise<{ success: boolean; message: string }> => {
  setLoading(true);
  try {
    const response = await requestService.updateRequestStatus(requestId, status);

    if (!response.data) {
      return { success: false, message: response.error || 'Failed to update request status' };
    }

    await refreshData();
    return { success: true, message: `Request ${status.toLowerCase()} successfully` };
  } finally {
    setLoading(false);
  }
};

  const addDonation = async (donation: Omit<Donation, 'id' | 'createdAt'>): Promise<ActionResult> => {
    setLoading(true);
    try {
      const response = await donationService.createDonation({
        donorId: donation.donorId,
        donorName: donation.donorName,
        bloodType: donation.bloodType,
        quantity: donation.quantity,
        donationDate: donation.donationDate,
      });

      if (!response.data) return { success: false, error: response.error || 'Failed to record donation' };

      await refreshData();
      return { success: true, message: 'Donation recorded' };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<ActionResult> => {
    setLoading(true);
    try {
      const response = await userService.deleteUser(userId);
      if (response.error) return { success: false, error: response.error || 'Failed to delete user' };
      await refreshData();
      return { success: true, message: 'User deleted' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        donors,
        requests,
        inventory,
        donations,
        loading,
        login,
        logout,
        register,
        addDonor,
        removeDonor,
        addRequest,
        updateRequestStatus,
        addDonation,
        deleteUser,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
