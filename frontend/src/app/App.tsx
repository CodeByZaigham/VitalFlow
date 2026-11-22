import React, { useEffect, useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toaster } from './components/ui/sonner';

// Customer Portal Pages
import { BloodRequestPage } from './components/customer/BloodRequestPage';
import { AvailableDonorsPage } from './components/customer/AvailableDonorsPage';
import { BloodInventoryPage } from './components/customer/BloodInventoryPage';
import { AboutPage } from './components/customer/AboutPage';

// Admin Portal Pages
import { DashboardPage } from './components/admin/DashboardPage';
import { CustomerRequestsPage } from './components/admin/CustomerRequestsPage';
import { EnrolledDonorsPage } from './components/admin/EnrolledDonorsPage';
import { RecordDonationPage } from './components/admin/RecordDonationPage';
import { DonationHistoryPage } from './components/admin/DonationHistoryPage';
import { ManageUsersPage } from './components/admin/ManageUsersPage';

function AppContent() {
  const { currentUser, loading } = useAppContext();

  // Start with a safe default (will be corrected after login)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'blood-request'>('blood-request');

  // ✅ FIX: When user logs in / session restores, set correct initial page
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'admin') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('blood-request');
    }
  }, [currentUser]);

  // ✅ FIX: Listen for custom navigation events (Request Blood redirect)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ page?: string }>;
      const page = ce.detail?.page;
      if (page) setCurrentPage(page as any);
    };

    window.addEventListener('bdms:navigate', handler as EventListener);
    return () => window.removeEventListener('bdms:navigate', handler as EventListener);
  }, []);

  // Show loading spinner during initial load
  if (loading && !currentUser) {
    return <LoadingSpinner fullScreen />;
  }

  // If not logged in, show login page
  if (!currentUser) {
    return <LoginPage />;
  }

  
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
