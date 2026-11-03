import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType } from '../../types';
import { toast } from 'sonner';
import { Droplet, Clock, MapPin } from 'lucide-react';

export const BloodRequestPage: React.FC = () => {
  const { currentUser, requests, addRequest } = useAppContext();

  const [bloodType, setBloodType] = useState<BloodType>('A+');
  const [quantity, setQuantity] = useState<string>('500');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const prefill = localStorage.getItem('prefill_blood_type');
    if (prefill) {
      setBloodType(prefill as BloodType);
      localStorage.removeItem('prefill_blood_type');
    }
  }, []);

  const userRequests = useMemo(() => {
    if (!currentUser) return [];
    return requests.filter(r => r.userId === currentUser.id);
  }, [requests, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (!city.trim() || !reason.trim()) {
      toast.error('All fields are required');
      return;
    }
    if (!Number.isFinite(qty) || qty < 1) {
      toast.error('Quantity must be at least 1 ml');
      return;
    }

    setIsSubmitting(true);
    const res = await addRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      bloodType,
      quantity: qty,
      city: city.trim(),
      urgency,
      reason: reason.trim(),
    });
    setIsSubmitting(false);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success('Blood request submitted successfully!');
    setQuantity('500');
    setCity('');
    setReason('');
    setUrgency('Medium');
    setBloodType('A+');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getUrgencyColor = (u: string) => {
    switch (u) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="mr-2 h-6 w-6 text-red-500" />
              Request Blood
            </CardTitle>
            <CardDescription>Fill out the form to request blood</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <Select value={bloodType} onValueChange={(v) => setBloodType(v as BloodType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                        <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity (ml)</Label>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select value={urgency} onValueChange={(v) => setUrgency(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required />
              </div>

              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>My Blood Requests</CardTitle>
            <CardDescription>View all your submitted blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            {userRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No requests submitted yet</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRequests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell><Badge variant="outline">{r.bloodType}</Badge></TableCell>
                        <TableCell>{r.quantity} ml</TableCell>
                        <TableCell><div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{r.city}</div></TableCell>
                        <TableCell><Badge variant="outline" className={getUrgencyColor(r.urgency)}>{r.urgency}</Badge></TableCell>
                        <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                        <TableCell><Badge variant="outline" className={getStatusColor(r.status)}>{r.status}</Badge></TableCell>
                        <TableCell><div className="flex items-center text-sm text-gray-500"><Clock className="h-4 w-4 mr-1" />{new Date(r.createdAt).toLocaleDateString()}</div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
