import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Droplets, LogOut, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser, logout } = useAppContext();

  const isAdmin = currentUser?.role === 'admin';

  const customerPages = [
    { id: 'blood-request', label: 'Blood Request' },
    { id: 'available-donors', label: 'Available Donors' },
    { id: 'blood-inventory', label: 'Blood Inventory' },
    { id: 'about', label: 'About' },
  ];

  const adminPages = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'customer-requests', label: 'Customer Requests' },
    { id: 'enrolled-donors', label: 'Enrolled Donors' },
    { id: 'record-donation', label: 'Record Donation' },
    { id: 'donation-history', label: 'Donation History' },
    { id: 'manage-users', label: 'Manage Users' },
  ];

  const pages = isAdmin ? adminPages : customerPages;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg">Blood Bank</h1>
              <p className="text-xs text-gray-500">
                {isAdmin ? 'Admin Portal' : 'Customer Portal'}
              </p>
            </div>
          </motion.div>

          <div className="hidden md:flex space-x-1">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={currentPage === page.id ? 'default' : 'ghost'}
                onClick={() => onNavigate(page.id)}
                className={`transition-all duration-200 ${
                  currentPage === page.id
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'hover:bg-red-50'
                }`}
              >
                {page.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-3 flex overflow-x-auto space-x-2">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={currentPage === page.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate(page.id)}
              className={`whitespace-nowrap ${
                currentPage === page.id
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'hover:bg-red-50'
              }`}
            >
              {page.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};