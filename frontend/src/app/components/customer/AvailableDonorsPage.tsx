import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType, HealthStatus, Gender } from '../../types';
import { toast } from 'sonner';
import { User, Heart, Phone, MapPin, Droplet, UserPlus, Calendar } from 'lucide-react';

export const AvailableDonorsPage: React.FC = () => {
  const { currentUser, donors, addDonor } = useAppContext();
  const [searchCity, setSearchCity] = useState('');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'All'>('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorAge, setDonorAge] = useState('');
  const [donorBloodType, setDonorBloodType] = useState<BloodType>('A+');
  const [donorGender, setDonorGender] = useState<Gender>('Male');
  const [donorCity, setDonorCity] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorHealthStatus, setDonorHealthStatus] = useState<HealthStatus>('Fit');
  const [lastDonationDate, setLastDonationDate] = useState('');

  const filteredDonors = donors.filter(donor => {
    const matchesCity = !searchCity || donor.city.toLowerCase().includes(searchCity.toLowerCase());
    const matchesBloodType = filterBloodType === 'All' || donor.bloodType === filterBloodType;
    return matchesCity && matchesBloodType && donor.isAvailable;
  });

  const handleBecomeDonor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    const age = parseInt(donorAge, 10);
    if (!Number.isFinite(age)) {
      toast.error('Age is required');
      return;
    }
    if (age < 18) {
      toast.error('You must be at least 18 years old to donate blood');
      return;
    }

    if (donorHealthStatus !== 'Fit') {
      toast.error('Only individuals with Fit health status can become donors');
      return;
    }

    const digits = donorPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    if (lastDonationDate) {
      const lastDonation = new Date(lastDonationDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      if (lastDonation > threeMonthsAgo) {
        toast.error('Last donation must be at least 3 months ago');
        return;
      }
    }

    setIsSubmitting(true);
    const res = await addDonor({
      userId: currentUser.id,
      name: donorName.trim() || currentUser.name,
      age,
      bloodType: donorBloodType,
      gender: donorGender,
      healthStatus: donorHealthStatus,
      city: donorCity.trim(),
      phone: donorPhone.trim(),
      lastDonationDate: lastDonationDate || undefined,
      isAvailable: true,
    });
    setIsSubmitting(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success('Successfully registered as a donor!');
    setIsDialogOpen(false);

    setDonorAge('');
    setDonorCity('');
    setDonorPhone('');
    setLastDonationDate('');
  };

  const handleRequestBlood = (donor: any) => {
    localStorage.setItem('prefill_blood_type', donor.bloodType);
    window.dispatchEvent(new CustomEvent('bdms:navigate', { detail: { page: 'blood-request' } }));
    toast.info(`Redirecting to Blood Request page for ${donor.bloodType}`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Donors</CardTitle>
            <CardDescription>Search for available donors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-city">Search by City</Label>
                <Input id="search-city" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-blood-type">Filter by Blood Type</Label>
                <Select value={filterBloodType} onValueChange={(v) => setFilterBloodType(v as any)}>
                  <SelectTrigger id="filter-blood-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Blood Types</SelectItem>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                      <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor, index) => (
          <motion.div key={donor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Card className="shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" />{donor.name}</CardTitle>
                  <Badge variant="outline" className="border-red-200 text-red-700">{donor.bloodType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm"><Calendar className="mr-2 h-4 w-4" />Age: <span className="ml-2">{donor.age}</span></div>
                  <div className="flex items-center text-sm"><Heart className="mr-2 h-4 w-4" />Health: <span className="ml-2">{donor.healthStatus}</span></div>
                  <div className="flex items-center text-sm"><MapPin className="mr-2 h-4 w-4" />City: <span className="ml-2">{donor.city}</span></div>
                  <div className="flex items-center text-sm"><Phone className="mr-2 h-4 w-4" />Phone: <span className="ml-2">{donor.phone}</span></div>
                </div>
                <Button onClick={() => handleRequestBlood(donor)} className="w-full bg-red-500 hover:bg-red-600 mt-4">
                  <Droplet className="mr-2 h-4 w-4" /> Request Blood
                </Button>
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex justify-center mt-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              <UserPlus className="mr-2 h-5 w-5" /> Become a Donor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register as a Blood Donor</DialogTitle>
              <DialogDescription>Fill out the form to register as a blood donor</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBecomeDonor} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={donorName} onChange={(e) => setDonorName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={donorAge} onChange={(e) => setDonorAge(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Select value={donorBloodType} onValueChange={(v) => setDonorBloodType(v as BloodType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                        <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={donorGender} onValueChange={(v) => setDonorGender(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={donorCity} onChange={(e) => setDonorCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Health Status</Label>
                  <Select value={donorHealthStatus} onValueChange={(v) => setDonorHealthStatus(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fit">Fit</SelectItem>
                      <SelectItem value="Not Fit">Not Fit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Last Donation Date (Optional)</Label>
                  <Input type="date" value={lastDonationDate} onChange={(e) => setLastDonationDate(e.target.value)} />
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register as Donor'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};