import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType } from '../../types';
import { History, Filter, Calendar } from 'lucide-react';

export const DonationHistoryPage: React.FC = () => {
  const { donations, donors } = useAppContext();
  const [searchDonor, setSearchDonor] = useState('');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'All'>('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const filteredDonations = donations.filter(donation => {
    const matchesDonor = !searchDonor || 
      donation.donorName.toLowerCase().includes(searchDonor.toLowerCase());
    const matchesBloodType = filterBloodType === 'All' || donation.bloodType === filterBloodType;
    
    const donationDate = new Date(donation.donationDate);
    const matchesDateFrom = !filterDateFrom || donationDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || donationDate <= new Date(filterDateTo);
    
    return matchesDonor && matchesBloodType && matchesDateFrom && matchesDateTo;
  });

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'border-red-200 text-red-700 bg-red-50',
      'A-': 'border-pink-200 text-pink-700 bg-pink-50',
      'B+': 'border-blue-200 text-blue-700 bg-blue-50',
      'B-': 'border-indigo-200 text-indigo-700 bg-indigo-50',
      'AB+': 'border-purple-200 text-purple-700 bg-purple-50',
      'AB-': 'border-violet-200 text-violet-700 bg-violet-50',
      'O+': 'border-orange-200 text-orange-700 bg-orange-50',
      'O-': 'border-amber-200 text-amber-700 bg-amber-50',
    };
    return colors[bloodType] || 'border-gray-200 text-gray-700 bg-gray-50';
  };

  const totalDonatedQuantity = filteredDonations.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-6 w-6 text-blue-500" />
              Filter Donations
            </CardTitle>
            <CardDescription>Search and filter donation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-donor">Search by Donor</Label>
                <Input
                  id="search-donor"
                  type="text"
                  placeholder="Enter donor name..."
                  value={searchDonor}
                  onChange={(e) => setSearchDonor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-blood-type">Blood Type</Label>
                <Select value={filterBloodType} onValueChange={(value) => setFilterBloodType(value as BloodType | 'All')}>
                  <SelectTrigger id="filter-blood-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Blood Types</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-from">Date From</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Date To</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-red-600 mb-1">{filteredDonations.length}</p>
                <p className="text-sm text-gray-600">Total Donations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-blue-600 mb-1">
                  {totalDonatedQuantity.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">ml Donated</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-green-600 mb-1">
                  {new Set(filteredDonations.map(d => d.donorId)).size}
                </p>
                <p className="text-sm text-gray-600">Unique Donors</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-6 w-6 text-purple-500" />
              Donation History
            </CardTitle>
            <CardDescription>
              Complete record of all blood donations ({filteredDonations.length} {filteredDonations.length === 1 ? 'donation' : 'donations'})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <History className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No donations found matching your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Donation Date</TableHead>
                      <TableHead>Recorded On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations
                      .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
                      .map((donation) => (
                        <TableRow key={donation.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <p className="font-medium">{donation.donorName}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getBloodTypeColor(donation.bloodType)}>
                              {donation.bloodType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{donation.quantity} ml</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Donations by Blood Type</CardTitle>
            <CardDescription>Breakdown of donations for each blood type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodType[]).map(bloodType => {
                const typeDonations = filteredDonations.filter(d => d.bloodType === bloodType);
                const typeQuantity = typeDonations.reduce((sum, d) => sum + d.quantity, 0);
                return (
                  <div key={bloodType} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border hover:shadow-md transition-shadow">
                    <Badge variant="outline" className={`mb-2 ${getBloodTypeColor(bloodType)}`}>
                      {bloodType}
                    </Badge>
                    <p className="text-2xl text-gray-800 mb-1">{typeDonations.length}</p>
                    <p className="text-xs text-gray-600">Donations</p>
                    <p className="text-sm text-gray-700 mt-1">{typeQuantity} ml</p>
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
