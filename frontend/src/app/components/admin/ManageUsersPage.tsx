import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner';
import { Users, Trash2, Shield, User as UserIcon } from 'lucide-react';
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

export const ManageUsersPage: React.FC = () => {
  const { users, deleteUser, currentUser } = useAppContext();

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    deleteUser(userId);
    toast.success(`User ${userName} has been deleted`);
  };

  const customerUsers = users.filter(u => u.role === 'customer');
  const adminUsers = users.filter(u => u.role === 'admin');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl mb-2">User Management</h1>
        <p className="text-gray-600">Manage all system users</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{users.length}</div>
              <p className="text-xs text-gray-600">Registered in system</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Customer Users</CardTitle>
              <UserIcon className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{customerUsers.length}</div>
              <p className="text-xs text-gray-600">Regular users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Admin Users</CardTitle>
              <Shield className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">{adminUsers.length}</div>
              <p className="text-xs text-gray-600">Administrator accounts</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-6 w-6 text-blue-500" />
              Customer Users
            </CardTitle>
            <CardDescription>
              All registered customer accounts ({customerUsers.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No customer users registered yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <UserIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Customer
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the user <strong>{user.name}</strong> and all associated data including:
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Blood requests</li>
                                    <li>Donor registration (if any)</li>
                                  </ul>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-6 w-6 text-purple-500" />
              Admin Users
            </CardTitle>
            <CardDescription>
              All administrator accounts ({adminUsers.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Shield className="h-5 w-5 text-purple-600" />
                          </div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Admin
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.id === currentUser?.id ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Current User
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
