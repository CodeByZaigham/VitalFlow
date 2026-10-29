import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { useAppContext } from '../../contexts/AppContext';
import { Droplets, Users, Activity, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, inventory, donations, donors, loading, refreshData } = useAppContext();

  // Fix #1: ensure data is fetched when this page loads (prevents zeros until reload)
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const totalDonations = donations.length;
  const totalDonors = donors.length;
  const totalBloodAvailable = inventory.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const recentDonations = useMemo(() => donations.slice(0, 5), [donations]);

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'from-red-400 to-red-600',
      'A-': 'from-pink-400 to-pink-600',
      'B+': 'from-blue-400 to-blue-600',
      'B-': 'from-indigo-400 to-indigo-600',
      'AB+': 'from-purple-400 to-purple-600',
      'AB-': 'from-violet-400 to-violet-600',
      'O+': 'from-orange-400 to-orange-600',
      'O-': 'from-amber-400 to-amber-600',
    };
    return colors[bloodType] || 'from-gray-400 to-gray-600';
  };

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity > 4000) return { text: 'Excellent', color: 'text-green-600' };
    if (quantity > 2000) return { text: 'Good', color: 'text-blue-600' };
    if (quantity > 1000) return { text: 'Low', color: 'text-orange-600' };
    return { text: 'Critical', color: 'text-red-600' };
  };

  // Fix: Math.max crash when inventory is empty
  const maxQuantity = useMemo(() => {
    if (!inventory.length) return 1; // avoid divide-by-zero
    return Math.max(...inventory.map(i => Number(i.quantity) || 0), 1);
  }, [inventory]);

  if (!currentUser) {
    return (
      <div className="p-6 text-gray-600">
        Please login first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of blood bank operations</p>
        {loading && <p className="text-sm text-gray-500 mt-2">Loading dashboard data…</p>}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Donations</CardTitle>
              <Activity className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{totalDonations}</div>
              <p className="text-xs text-gray-600">All-time donations recorded</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Donors</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{totalDonors}</div>
              <p className="text-xs text-gray-600">Registered blood donors</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Available Blood</CardTitle>
              <Droplets className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{totalBloodAvailable.toLocaleString()}</div>
              <p className="text-xs text-gray-600">ml of blood in stock</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Blood Inventory Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="mr-2 h-6 w-6 text-red-500" />
              Blood Inventory
            </CardTitle>
            <CardDescription>Current stock levels for all blood types</CardDescription>
          </CardHeader>

          <CardContent>
            {inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No inventory records found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((item, index) => {
                  const qty = Number(item.quantity) || 0;
                  const status = getAvailabilityStatus(qty);

                  // Fix: avoid NaN
                  const progressPercent = maxQuantity ? Math.min(100, Math.max(0, (qty / maxQuantity) * 100)) : 0;

                  return (
                    <motion.div
                      key={item.bloodType}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${getBloodTypeColor(item.bloodType)}`} />
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-2xl">{item.bloodType}</CardTitle>
                            </div>
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getBloodTypeColor(
                                item.bloodType
                              )} shadow-md`}
                            >
                              <Droplets className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Quantity</span>
                              <span className="text-base">{qty.toLocaleString()} ml</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`text-sm ${status.color}`}>{status.text}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Donations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-green-500" />
              Recent Donations
            </CardTitle>
            <CardDescription>Latest blood donation activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDonations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No donations recorded yet</div>
            ) : (
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${getBloodTypeColor(
                          donation.bloodType
                        )} flex items-center justify-center text-white shadow-md`}
                      >
                        {donation.bloodType}
                      </div>
                      <div>
                        <p className="font-semibold">{donation.donorName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">{donation.quantity} ml</p>
                      <p className="text-xs text-gray-500">Donated</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
