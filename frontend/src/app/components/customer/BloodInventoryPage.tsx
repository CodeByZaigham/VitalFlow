import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { useAppContext } from '../../contexts/AppContext';
import { Droplets } from 'lucide-react';

export const BloodInventoryPage: React.FC = () => {
  const { inventory } = useAppContext();

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

  // ✅ SAFE: avoid Math.max on empty array
  const maxQuantity = useMemo(() => {
    if (!inventory || inventory.length === 0) return 0;
    return Math.max(...inventory.map(i => i.quantity ?? 0));
  }, [inventory]);

  // ✅ FIX: Summary counts should reflect "blood exists" (not only >2000)
  // Available = quantity > 0 (has blood)
  // Low/Critical can be based on your existing thresholds
  const summary = useMemo(() => {
    const items = inventory ?? [];
    const totalMl = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

    const typesAvailable = items.filter(i => (i.quantity ?? 0) > 0).length;
    const typesLow = items.filter(i => (i.quantity ?? 0) > 0 && (i.quantity ?? 0) <= 1000).length;
    const typesCritical = items.filter(i => (i.quantity ?? 0) === 0).length;

    return { totalMl, typesAvailable, typesLow, typesCritical };
  }, [inventory]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg bg-gradient-to-br from-red-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Droplets className="mr-2 h-7 w-7 text-red-500" />
              Blood Inventory
            </CardTitle>
            <CardDescription>Current blood availability in the blood bank</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {(!inventory || inventory.length === 0) ? (
        <Card className="shadow-lg">
          <CardContent className="py-10 text-center text-gray-500">
            No inventory data found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item, index) => {
            const qty = item.quantity ?? 0;
            const status = getAvailabilityStatus(qty);

            // ✅ SAFE: avoid division by 0 / NaN
            const progressPercent =
              maxQuantity > 0 ? Math.min(100, Math.max(0, (qty / maxQuantity) * 100)) : 0;

            return (
              <motion.div
                key={item.bloodType}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getBloodTypeColor(item.bloodType)}`} />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl">{item.bloodType}</CardTitle>
                        <CardDescription className="mt-1">Blood Type</CardDescription>
                      </div>
                      <div
                        className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${getBloodTypeColor(
                          item.bloodType
                        )} shadow-lg`}
                      >
                        <Droplets className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Quantity</span>
                        <span className="text-lg">{qty.toLocaleString()} ml</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`font-semibold ${status.color}`}>{status.text}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated:{' '}
                      {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '—'}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>Total blood availability across all types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl text-red-600 mb-1">{summary.totalMl.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total ml</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl text-green-600 mb-1">{summary.typesAvailable}</p>
                <p className="text-sm text-gray-600">Types Available</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl text-orange-600 mb-1">{summary.typesLow}</p>
                <p className="text-sm text-gray-600">Types Low</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl text-red-600 mb-1">{summary.typesCritical}</p>
                <p className="text-sm text-gray-600">Types Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
