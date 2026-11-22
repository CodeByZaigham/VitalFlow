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

