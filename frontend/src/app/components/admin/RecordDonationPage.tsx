import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType } from '../../types';
import { toast } from 'sonner';
import { Activity, Droplet } from 'lucide-react';

export const RecordDonationPage: React.FC = () => {
  const { donors, addDonation } = useAppContext();
  const [selectedDonorId, setSelectedDonorId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedDonor = donors.find(d => d.id === selectedDonorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDonorId) {
      toast.error('Please select a donor');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (quantityNum > 500) {
      toast.error('Maximum donation quantity is 500ml per session');
      return;
    }

    if (!selectedDonor) {
      toast.error('Donor not found');
      return;
    }

    // Check if donor is fit
    if (selectedDonor.healthStatus !== 'Fit') {
      toast.error('Only donors with Fit health status can donate');
      return;
    }

    // Check last donation date (must be at least 3 months ago)
    if (selectedDonor.lastDonationDate) {
      const lastDonation = new Date(selectedDonor.lastDonationDate);
      const donationDateObj = new Date(donationDate);
      const threeMonthsAgo = new Date(donationDateObj);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (lastDonation > threeMonthsAgo) {
        toast.error('Donor must wait at least 3 months between donations');
        return;
      }
    }

    addDonation({
      donorId: selectedDonor.id,
      donorName: selectedDonor.name,
      bloodType: selectedDonor.bloodType,
      quantity: quantityNum,
      donationDate
    });

    toast.success('Donation recorded successfully! Inventory updated.');
    setSelectedDonorId('');
    setQuantity('');
    setDonationDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Activity className="mr-2 h-7 w-7 text-red-500" />
              Record Blood Donation
            </CardTitle>
            <CardDescription>
              Register a new blood donation and update inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="donor">Select Donor</Label>
                <Select value={selectedDonorId} onValueChange={setSelectedDonorId}>
                  <SelectTrigger id="donor">
                    <SelectValue placeholder="Choose a donor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {donors
                      .filter(d => d.isAvailable && d.healthStatus === 'Fit')
                      .map(donor => (
                        <SelectItem key={donor.id} value={donor.id}>
                          {donor.name} - {donor.bloodType} ({donor.city})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDonor && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                >
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Droplet className="mr-2 h-5 w-5 text-blue-600" />
                    Donor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedDonor.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="ml-2 font-medium">{selectedDonor.bloodType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{selectedDonor.age} years</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Health:</span>
                      <span className="ml-2 font-medium">{selectedDonor.healthStatus}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Last Donation:</span>
                      <span className="ml-2 font-medium">
                        {selectedDonor.lastDonationDate
                          ? new Date(selectedDonor.lastDonationDate).toLocaleDateString()
                          : 'First time donor'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (ml)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="450"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    max={500}
                    required
                  />
                  <p className="text-xs text-gray-500">Maximum 500ml per donation</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donation-date">Donation Date</Label>
                  <Input
                    id="donation-date"
                    type="date"
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800">
                <p className="font-semibold mb-2">Donation Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Donor must have Fit health status</li>
                  <li>Minimum 3 months gap between donations</li>
                  <li>Maximum 500ml per donation session</li>
                  <li>Inventory will be automatically updated</li>
                </ul>
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                <Activity className="mr-2 h-5 w-5" />
                Record Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Available donors ready to donate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bloodType => {
                const count = donors.filter(
                  d => d.bloodType === bloodType && d.isAvailable && d.healthStatus === 'Fit'
                ).length;
                return (
                  <div key={bloodType} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl text-red-600 mb-1">{count}</p>
                    <p className="text-xs text-gray-600">{bloodType} Donors</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
