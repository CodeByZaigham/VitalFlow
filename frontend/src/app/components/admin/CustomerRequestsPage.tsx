import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useAppContext } from '../../contexts/AppContext';
import { BloodType } from '../../types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

export const CustomerRequestsPage: React.FC = () => {
  // ✅ include inventory so we can check stock before approving
  const { requests, updateRequestStatus, inventory } = useAppContext();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'All'>('All');

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
      const matchesBloodType = filterBloodType === 'All' || request.bloodType === filterBloodType;
      return matchesStatus && matchesBloodType;
    });
  }, [requests, filterStatus, filterBloodType]);

  const handleApprove = async (requestId: string) => {
    try {
      const res = await updateRequestStatus(requestId, 'Approved');

      if (res.success) {
        toast.success(res.message || 'Request approved');
      } else {
        toast.error(res.message || 'Failed to approve request');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const res = await updateRequestStatus(requestId, 'Rejected');

      if (res.success) {
        toast.success(res.message || 'Request rejected');
      } else {
        toast.error(res.message || 'Failed to reject request');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject request');
    }
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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
              <Filter className="mr-2 h-6 w-6 text-blue-500" />
              Filter Requests
            </CardTitle>
            <CardDescription>Filter blood requests by status and blood type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                  <SelectTrigger id="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-blood-type">Blood Type</Label>
                <Select value={filterBloodType} onValueChange={(value) => setFilterBloodType(value as any)}>
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Customer Blood Requests</CardTitle>
            <CardDescription>
              Manage all blood requests from customers ({filteredRequests.length}{' '}
              {filteredRequests.length === 1 ? 'request' : 'requests'})
            </CardDescription>
          </CardHeader>

          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredRequests.map((request) => {
                      // ✅ stock check per request
                      const inv = inventory.find((i) => i.bloodType === request.bloodType);
                      const availableQty = inv?.quantity ?? 0;
                      const canApprove = availableQty >= request.quantity;

                      return (
                        <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.userName}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="border-red-200 text-red-700">
                              {request.bloodType}
                            </Badge>
                            {request.status === 'Pending' && !canApprove && (
                              <div className="text-xs text-red-500 mt-1">
                                Not enough stock ({availableQty} ml available)
                              </div>
                            )}
                          </TableCell>

                          <TableCell>{request.quantity} ml</TableCell>
                          <TableCell>{request.city}</TableCell>

                          <TableCell>
                            <Badge variant="outline" className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                          </TableCell>

                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>

                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {request.status === 'Pending' ? (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={!canApprove}
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(request.id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400 transition-colors"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">{request.status}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-yellow-600 mb-1">{requests.filter((r) => r.status === 'Pending').length}</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-green-600 mb-1">{requests.filter((r) => r.status === 'Approved').length}</p>
                <p className="text-sm text-gray-600">Approved Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl text-red-600 mb-1">{requests.filter((r) => r.status === 'Rejected').length}</p>
                <p className="text-sm text-gray-600">Rejected Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
