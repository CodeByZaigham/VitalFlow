import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType } from '../../types';
import { toast } from 'sonner';
import { User, Heart, Phone, MapPin, Trash2, Calendar, Filter } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

export const EnrolledDonorsPage: React.FC = () => {
  const { donors, removeDonor } = useAppContext();
  const [searchCity, setSearchCity] = useState('');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'All'>('All');
  const [filterAvailability, setFilterAvailability] = useState<'All' | 'Available' | 'Unavailable'>('All');

  const filteredDonors = donors.filter(donor => {
    const matchesCity = !searchCity || donor.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchesBloodType = filterBloodType === 'All' || donor.bloodType === filterBloodType;
    const matchesAvailability = 
      filterAvailability === 'All' || 
      (filterAvailability === 'Available' && donor.isAvailable) ||
      (filterAvailability === 'Unavailable' && !donor.isAvailable);
    return matchesCity && matchesBloodType && matchesAvailability;
  });

  const handleRemoveDonor = (donorId: string, donorName: string) => {
    removeDonor(donorId);
    toast.success(`${donorName} has been removed from donors`);
  };

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
              Filter Donors
            </CardTitle>
            <CardDescription>Search and filter enrolled donors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-city">Search by City</Label>
                <Input
                  id="search-city"
                  type="text"
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
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
                <Label htmlFor="filter-availability">Availability</Label>
                <Select value={filterAvailability} onValueChange={(value) => setFilterAvailability(value as any)}>
                  <SelectTrigger id="filter-availability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Donors</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Enrolled Donors ({filteredDonors.length})</h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor, index) => (
          <motion.div
            key={donor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    {donor.name}
                  </CardTitle>
                  <Badge variant="outline" className="border-red-200 text-red-700">
                    {donor.bloodType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Age:</span>
                    <span className="ml-2">{donor.age} years</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Gender:</span>
                    <span className="ml-2">{donor.gender}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Heart className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Health:</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        donor.healthStatus === 'Fit' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {donor.healthStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">City:</span>
                    <span className="ml-2">{donor.city}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2">{donor.phone}</span>
                  </div>
                  {donor.lastDonationDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Last Donation:</span>
                      <span className="ml-2">
                        {new Date(donor.lastDonationDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        donor.isAvailable 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Donor
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove <strong>{donor.name}</strong> from the donors list. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveDonor(donor.id, donor.name)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <User className="mx-auto h-12 w-12 mb-4 text-gray-300" />
          <p>No donors found matching your criteria</p>
        </div>
      )}

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-md bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-blue-600 mb-1">{donors.length}</p>
                <p className="text-sm text-gray-600">Total Donors</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-green-600 mb-1">
                  {donors.filter(d => d.isAvailable).length}
                </p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-purple-600 mb-1">
                  {donors.filter(d => d.healthStatus === 'Fit').length}
                </p>
                <p className="text-sm text-gray-600">Fit Status</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-orange-600 mb-1">
                  {new Set(donors.map(d => d.city)).size}
                </p>
                <p className="text-sm text-gray-600">Cities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
