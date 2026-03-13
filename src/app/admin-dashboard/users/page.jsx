'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { API } from '@/lib/api/api';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit State
  const [editData, setEditData] = useState({});
  const { toast } = useToast();

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API.getAllUsers);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Auto-calculate total members
  useEffect(() => {
    if (isSheetOpen) {
       const adults = parseInt(editData.totalAdults) || 0;
       const children = parseInt(editData.totalChildren) || 0;
       const total = adults + children;
       if (editData.totalMembers !== total) {
           setEditData(prev => ({ ...prev, totalMembers: total }));
       }
    }
  }, [editData.totalAdults, editData.totalChildren, isSheetOpen]);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        // Personal
        gender: user.gender || "",
        age: user.age || "",
        address: user.address || "",
        alternatePhone: user.alternatePhone || "",
        // Booking
        bookingPersonName: user.bookingPersonName || "",
        totalAdults: user.totalAdults || 0,
        totalChildren: user.totalChildren || 0,
        childrenNames: user.childrenNames || "",
        totalMembers: user.totalMembers || 0,
        travelDate: user.travelDate || "",
        returnDate: user.returnDate || "",
        destination: user.destination || "",
        pickupLocation: user.pickupLocation || "",
        bookingStatus: user.bookingStatus || "",
        paymentStatus: user.paymentStatus || "",
        // Additional
        notes: user.notes || "",
        specialRequest: user.specialRequest || "",
    });
    setIsSheetOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(API.updateUser(selectedUser._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "User information updated successfully.",
        });
        setIsSheetOpen(false);
        getAllUsers(); // Refresh list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(API.deleteUser(selectedUser._id), {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Deleted",
          description: "User has been removed from the system.",
        });
        setIsDeleteDialogOpen(false);
        setIsSheetOpen(false);
        getAllUsers(); // Refresh list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-[#1a1a1a]">
        <Skeleton className="h-9 w-48 mb-6" />
        <Card className="border-none shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 h-[80px]">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-[150px]" />
                       <Skeleton className="h-3 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1a1a1a]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline tracking-tight">Registered Users</h1>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white/50 border-b pb-4">
          <CardTitle className="text-lg">All Registered Users</CardTitle>
          <CardDescription>
            Manage and view detailed information for all registered accounts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] h-12">User</TableHead>
                  <TableHead className="h-12">Phone Number</TableHead>
                  <TableHead className="text-right h-12 pr-6">Joined Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow 
                        key={user._id} 
                        className="cursor-pointer hover:bg-muted/20 transition-colors h-[80px]"
                        onClick={() => handleRowClick(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground leading-tight">{user.name}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-muted-foreground">{user.phone}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span className="text-sm text-muted-foreground">
                            {user.createdAt ? format(parseISO(user.createdAt), 'MMM dd, yyyy') : '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                      No users found in the database.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[600px] p-0 flex flex-col border-l shadow-2xl">
          <SheetHeader className="p-6 border-b bg-white">
            <SheetTitle className="text-xl font-bold">User Details & Booking</SheetTitle>
            <SheetDescription>
              View and manage profile and booking information for {selectedUser?.name}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-6">
            <div className="py-6 space-y-8 pb-32">
                {/* 1. Basic Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                className="border-gray-200 focus:border-primary"
                                value={editData.name} 
                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                className="border-gray-200"
                                value={editData.email} 
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                                id="phone" 
                                className="border-gray-200"
                                value={editData.phone} 
                                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* 2. Booking Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-yellow-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Booking Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="bookingPersonName">Booking Person Name</Label>
                            <Input 
                                id="bookingPersonName" 
                                className="border-gray-200"
                                value={editData.bookingPersonName} 
                                onChange={(e) => setEditData({...editData, bookingPersonName: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="totalAdults">Total Adults</Label>
                            <Input 
                                id="totalAdults" 
                                type="number"
                                className="border-gray-200"
                                value={editData.totalAdults} 
                                onChange={(e) => setEditData({...editData, totalAdults: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="totalChildren">Total Children</Label>
                            <Input 
                                id="totalChildren" 
                                type="number"
                                className="border-gray-200"
                                value={editData.totalChildren} 
                                onChange={(e) => setEditData({...editData, totalChildren: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="childrenNames">Children Names (Comma Separated)</Label>
                            <Input 
                                id="childrenNames" 
                                className="border-gray-200"
                                placeholder="E.g. John, Sarah"
                                value={editData.childrenNames} 
                                onChange={(e) => setEditData({...editData, childrenNames: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="totalMembers" className="font-bold flex items-center justify-between">
                                Total Members 
                                <span className="text-[10px] text-primary italic font-normal">Auto-calculated</span>
                            </Label>
                            <Input 
                                id="totalMembers" 
                                readOnly
                                className="bg-muted border-gray-200 font-bold"
                                value={editData.totalMembers} 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="travelDate">Travel Date</Label>
                            <Input 
                                id="travelDate" 
                                placeholder="YYYY-MM-DD"
                                className="border-gray-200"
                                value={editData.travelDate} 
                                onChange={(e) => setEditData({...editData, travelDate: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="returnDate">Return Date</Label>
                            <Input 
                                id="returnDate" 
                                placeholder="YYYY-MM-DD"
                                className="border-gray-200"
                                value={editData.returnDate} 
                                onChange={(e) => setEditData({...editData, returnDate: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Input 
                                id="destination" 
                                className="border-gray-200"
                                value={editData.destination} 
                                onChange={(e) => setEditData({...editData, destination: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pickupLocation">Pickup Location</Label>
                            <Input 
                                id="pickupLocation" 
                                className="border-gray-200"
                                value={editData.pickupLocation} 
                                onChange={(e) => setEditData({...editData, pickupLocation: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bookingStatus">Booking Status</Label>
                            <Select 
                                value={editData.bookingStatus} 
                                onValueChange={(value) => setEditData({...editData, bookingStatus: value})}
                            >
                                <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="paymentStatus">Payment Status</Label>
                            <Select 
                                value={editData.paymentStatus} 
                                onValueChange={(value) => setEditData({...editData, paymentStatus: value})}
                            >
                                <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* 3. Personal Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-green-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select 
                                value={editData.gender} 
                                onValueChange={(value) => setEditData({...editData, gender: value})}
                            >
                                <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="age">Age</Label>
                            <Input 
                                id="age" 
                                type="number"
                                className="border-gray-200"
                                value={editData.age} 
                                onChange={(e) => setEditData({...editData, age: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                                id="address" 
                                className="min-h-[80px] border-gray-200"
                                value={editData.address} 
                                onChange={(e) => setEditData({...editData, address: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
                            <Input 
                                id="alternatePhone" 
                                className="border-gray-200"
                                value={editData.alternatePhone} 
                                onChange={(e) => setEditData({...editData, alternatePhone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* 4. Additional Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-purple-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Additional Information</h3>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes / Remarks</Label>
                            <Textarea 
                                id="notes" 
                                className="min-h-[100px] border-gray-200"
                                placeholder="Internal notes..."
                                value={editData.notes} 
                                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="specialRequest">Special Requests</Label>
                            <Textarea 
                                id="specialRequest" 
                                className="min-h-[100px] border-gray-200"
                                placeholder="Any passenger requests..."
                                value={editData.specialRequest} 
                                onChange={(e) => setEditData({...editData, specialRequest: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t bg-gray-50/80 sticky bottom-0 z-50 flex-col sm:flex-row gap-3">
            <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isUpdating || isDeleting}
            >
              Delete User
            </Button>
            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                <Button className="flex-1 sm:flex-none" onClick={handleUpdateUser} disabled={isUpdating || isDeleting}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <strong>{selectedUser?.name}&apos;s</strong> account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDeleteUser} 
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
