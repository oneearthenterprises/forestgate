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
import { cn } from "@/lib/utils";
import { ArrowRight, Search, AlertCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from '@/components/ui/pagination-nav';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // History States
  const [userHistory, setUserHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryBooking, setSelectedHistoryBooking] = useState(null);
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);
  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [tempBookingData, setTempBookingData] = useState(null);
  const [isUpdatingBooking, setIsUpdatingBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingDeleteDialogOpen, setIsBookingDeleteDialogOpen] = useState(false);
  
  // Custom Entries / Manual Booking Refinement
  const [rooms, setRooms] = useState([]);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Edit State
  const [editData, setEditData] = useState({});
  const { toast } = useToast();

  const getAllData = async (page = 1) => {
    try {
      setLoading(true);
      const [usersRes, roomsRes] = await Promise.all([
        fetch(`${API.getAllUsers}?page=${page}&limit=10`),
        fetch(API.GetAllRooms),
      ]);
      
      const [usersData, roomsData] = await Promise.all([
        usersRes.json(),
        roomsRes.json()
      ]);

      setUsers(usersData.users || []);
      setTotalPages(usersData.totalPages || 1);
      setCurrentPage(usersData.page || page);
      setRooms(roomsData.rooms || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load management data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData(currentPage);
  }, [currentPage]);

  const fetchUserHistory = async (email) => {
    if (!email) return;
    setLoadingHistory(true);
    try {
        const res = await fetch(API.GetUserHistory(email));
        const data = await res.json();
        setUserHistory(data.bookings || []);
    } catch (error) {
        console.error("Error fetching user history:", error);
    } finally {
        setLoadingHistory(false);
    }
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Auto-calculate counts and total members based on dynamic name lists
  useEffect(() => {
    if (isSheetOpen && editData.bookingPersonName && editData.childrenNames) {
        const adultCount = editData.bookingPersonName.length;
        const childCount = editData.childrenNames.length;
        const total = adultCount + childCount;
        
        if (editData.totalAdults !== adultCount || 
            editData.totalChildren !== childCount || 
            editData.totalMembers !== total) {
            setEditData(prev => ({ 
                ...prev, 
                totalAdults: adultCount,
                totalChildren: childCount,
                totalMembers: total
            }));
        }
    }
  }, [editData.bookingPersonName, editData.childrenNames, isSheetOpen]);

  const handleHistoryItemClick = (booking) => {
    setSelectedHistoryBooking(booking);
    setTempBookingData({
        ...booking, 
        destination: booking.destination || "Forest Gate Resort",
        pickupLocation: booking.pickupLocation || "Airport",
        addons: booking.addons || [],
        customFields: booking.customFields || []
    });
    setIsEditingBooking(false);
    setIsBookingDetailOpen(true);
  };

  const handleUpdateBooking = async () => {
    try {
        setIsUpdatingBooking(true);
        const response = await fetch(API.UpdateBooking(tempBookingData._id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tempBookingData)
        });

        if (response.ok) {
            toast({ title: "Updated", description: "Booking details have been saved." });
            setIsEditingBooking(false);
            fetchUserHistory(selectedUser.email); // Refresh history
        } else {
            const data = await response.json();
            toast({ title: "Error", description: data.message || "Failed to update booking.", variant: "destructive" });
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        toast({ title: "Error", description: "Failed to update record.", variant: "destructive" });
    } finally {
        setIsUpdatingBooking(false);
    }
  };

  const handleDeleteBooking = async () => {
    try {
        const response = await fetch(API.DeleteBooking(selectedHistoryBooking._id), { method: 'DELETE' });
        if (response.ok) {
            toast({ title: "Deleted", description: "Booking has been removed successfully." });
            setIsBookingDetailOpen(false);
            setIsBookingDeleteDialogOpen(false);
            fetchUserHistory(selectedUser.email);
        } else {
            toast({ title: "Error", description: "Failed to delete booking.", variant: "destructive" });
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
        toast({ title: "Error", description: "Failed to delete record.", variant: "destructive" });
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);

    // Improved parsing for Name (Gender, Age) with smart splitting
    const parseMember = (str) => {
        if (!str) return { name: "", gender: "", age: "" };
        // Matches "Name (Gender, Age)" or just "Name"
        const match = str.match(/^(.*?)\s*\((.*?),\s*(.*?)\)$/);
        if (match) {
            return {
                name: match[1].trim(),
                gender: match[2] === 'N/A' ? '' : match[2].trim(),
                age: match[3] === 'N/A' ? '' : match[3].trim()
            };
        }
        return { name: str.trim(), gender: "", age: "" };
    };

    // Split by comma only if NOT inside parentheses
    const smartSplit = (str) => {
        if (!str) return [];
        return str.split(/,\s*(?![^()]*\))/).filter(s => s.trim() !== "");
    };

    const kidsData = smartSplit(user.childrenNames);
    const partnersData = smartSplit(user.bookingPersonName);

    const kids = kidsData.length > 0 ? kidsData.map(parseMember) : [{ name: "", gender: "", age: "" }];
    const partners = partnersData.length > 0 ? partnersData.map(parseMember) : [{ name: "", gender: "", age: "" }];
    
    // Custom Fields parsing (Map -> Array)
    const extraFields = user.customFields ? Object.entries(user.customFields).map(([k, v]) => ({ key: k, value: v })) : [];

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
        bookingPersonName: partners,
        totalAdults: user.totalAdults || 0,
        totalChildren: user.totalChildren || 0,
        childrenNames: kids,
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

        occupation: user.occupation || "",
        companyName: user.companyName || "",
        corporatePartyOptions: user.corporatePartyOptions || false,
        customFields: extraFields.length > 0 ? extraFields : [],
        // Reset manual entry form states
        tempManualRoom: "",
        tempManualCheckIn: "",
        tempManualCheckOut: "",
        isCustomRoom: false
    });
    setIsCustomFormOpen(false);
    setIsSheetOpen(true);
    fetchUserHistory(user.email);
  };

  const handleUpdateUser = async () => {
    try {
      setIsUpdating(true);

      // Serialize back to Name (Gender, Age)
      const serializeMember = (m) => {
          if (!m.name) return "";
          if (!m.gender && !m.age) return m.name;
          return `${m.name} (${m.gender || 'N/A'}, ${m.age || 'N/A'})`;
      };

      const customFieldsObj = {};
      editData.customFields?.forEach(f => {
          if (f.key?.trim()) customFieldsObj[f.key.trim()] = f.value;
      });

      const finalData = {
          ...editData,
          customFields: customFieldsObj,
          bookingPersonName: editData.bookingPersonName
            .filter(n => n.name.trim() !== "")
            .map(serializeMember)
            .join(', '),
          childrenNames: editData.childrenNames
            .filter(n => n.name.trim() !== "")
            .map(serializeMember)
            .join(', ')
      };

      const response = await fetch(API.updateUser(selectedUser._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "User information updated successfully.",
        });
        setIsSheetOpen(false);
        getAllData(); // Refresh list
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
        getAllData(); // Refresh list
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
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBookingStatusColor = (status) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 text-[#1a1a1a]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline tracking-tight">Registered Users</h1>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white/50 border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">All Registered Users</CardTitle>
              <CardDescription>
                Manage and view detailed information for all registered accounts.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, email, phone, ID..." 
                className="pl-9 bg-white/80 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm h-10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px] h-12">User</TableHead>
                  <TableHead className="h-12">Phone Number</TableHead>
                  <TableHead className="h-12 text-center">Bookings</TableHead>
                  <TableHead className="text-right h-12 pr-6">Joined Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(() => {
                  const query = searchQuery.toLowerCase();
                  const filteredUsers = users.filter(user => 
                    String(user.name || "").toLowerCase().includes(query) ||
                    String(user.email || "").toLowerCase().includes(query) ||
                    String(user.phone || "").toLowerCase().includes(query) ||
                    String(user._id || "").toLowerCase().includes(query) ||
                    String(user.userId || "").toLowerCase().includes(query) ||
                    (user.bookingIds && user.bookingIds.some(id => String(id).toLowerCase().includes(query)))
                  );

                  return filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                    <TableRow
                        key={user._id}
                        className="cursor-pointer hover:bg-muted/20 transition-colors h-[80px]"
                        onClick={() => handleEditClick(user)}
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
                            {user.userId && <span className="text-[10px] text-muted-foreground mt-0.5 font-mono bg-muted px-1.5 py-0.5 rounded w-max">{user.userId}</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-muted-foreground">{user.phone}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-bold text-primary bg-primary/5">
                            {user.bookingCount || 0}
                        </Badge>
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
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      {searchQuery ? "No users match your search." : "No users found in the database."}
                    </TableCell>
                  </TableRow>
                )
              })()}
              </TableBody>
            </Table>
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="pb-4 pt-2 -mt-2 bg-white/50"
          />
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[600px] p-0 flex flex-col border-l shadow-2xl overflow-hidden">
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


                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-green-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Occupation</Label>
                            <Input
                                className="border-gray-200"
                                value={editData.occupation || "Not Provided"}
                                readOnly
                            />
                        </div>

                        {editData.occupation === "Business Owner" && (
                            <div className="grid gap-2">
                                <Label>Company Name</Label>
                                <Input
                                    className="border-gray-200"
                                    value={editData.companyName || "Not Provided"}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label>
                                {editData.occupation === "Business Owner"
                                ? "Corporate Party Interest"
                                : "Future Event Interest"}
                            </Label>

                            <Input
                                className="border-gray-200"
                                value={
                                editData.occupation === "Business Owner"
                                    ? editData.corporatePartyOptions
                                    ? "Interested in corporate party"
                                    : "Not interested"
                                    : "Interested in future event booking"
                                }
                                readOnly
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
 
                 {/* 5. Custom Entries / Manual Booking */}
                 <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="h-8 w-1 bg-cyan-500 rounded-full" />
                             <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Custom Entries</h3>
                         </div>
                         <Button
                             variant="outline"
                             size="sm"
                             className="h-8 border-dashed text-primary font-bold hover:bg-primary/5 gap-1 text-[10px]"
                             onClick={() => setIsCustomFormOpen(!isCustomFormOpen)}
                         >
                             {isCustomFormOpen ? "Close Form" : "+ Add Entry"}
                         </Button>
                     </div>

                     {isCustomFormOpen && (
                         <div className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1.5 col-span-2">
                                     <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Select Room</Label>
                                     <Select
                                         onValueChange={(val) => {
                                             if (val === "custom") {
                                                 setEditData({...editData, tempManualRoom: "", isCustomRoom: true});
                                             } else {
                                                 setEditData({...editData, tempManualRoom: val, isCustomRoom: false});
                                             }
                                         }}
                                     >
                                         <SelectTrigger className="h-10 bg-white border-gray-200">
                                             <SelectValue placeholder="Chose a room..." />
                                         </SelectTrigger>
                                         <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room._id} value={room.roomName}>{room.roomName}</SelectItem>
                                            ))}
                                            <SelectItem value="custom" className="text-primary font-bold">+ Other (Custom Name)</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>

                                 {editData.isCustomRoom && (
                                     <div className="space-y-1.5 col-span-2 animate-in zoom-in-95 duration-200">
                                         <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Custom Room Name</Label>
                                         <Input 
                                             className="h-10 bg-white border-primary/20 focus:border-primary shadow-sm"
                                             placeholder="Enter manual room name..."
                                             value={editData.tempManualRoom || ""}
                                             onChange={(e) => setEditData({...editData, tempManualRoom: e.target.value})}
                                         />
                                     </div>
                                 )}

                                 <div className="space-y-1.5">
                                     <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Check-In</Label>
                                     <Input 
                                         type="date"
                                         className="h-10 bg-white border-gray-200"
                                         value={editData.tempManualCheckIn || ""}
                                         onChange={(e) => setEditData({...editData, tempManualCheckIn: e.target.value})}
                                     />
                                 </div>

                                 <div className="space-y-1.5">
                                     <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Check-Out</Label>
                                     <Input 
                                         type="date"
                                         className="h-10 bg-white border-gray-200"
                                         value={editData.tempManualCheckOut || ""}
                                         onChange={(e) => setEditData({...editData, tempManualCheckOut: e.target.value})}
                                     />
                                 </div>

                                 <div className="space-y-1.5">
                                     <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Adults</Label>
                                     <Input 
                                         type="number"
                                         className="h-10 bg-white border-gray-200"
                                         value={editData.tempManualAdults || 1}
                                         onChange={(e) => setEditData({...editData, tempManualAdults: e.target.value})}
                                     />
                                 </div>

                                 <div className="space-y-1.5">
                                     <Label className="text-[10px] uppercase font-bold text-muted-foreground italic pl-1">Children</Label>
                                     <Input 
                                         type="number"
                                         className="h-10 bg-white border-gray-200"
                                         value={editData.tempManualChildren || 0}
                                         onChange={(e) => setEditData({...editData, tempManualChildren: e.target.value})}
                                     />
                                 </div>
                             </div>

                             <Button 
                                 className="w-full h-10 font-bold rounded-xl shadow-md shadow-primary/10"
                                 onClick={async () => {
                                     if (!editData.tempManualRoom) {
                                         toast({ title: "Error", description: "Please select/enter a room.", variant: "destructive" });
                                         return;
                                     }
                                     
                                     try {
                                         setIsUpdating(true);
                                         const bookingPayload = {
                                             roomId: editData.isCustomRoom ? "manual" : rooms.find(r => r.roomName === editData.tempManualRoom)?._id || "manual",
                                             roomName: editData.tempManualRoom,
                                             checkIn: editData.tempManualCheckIn,
                                             checkOut: editData.tempManualCheckOut,
                                             adults: editData.tempManualAdults || 1,
                                             children: editData.tempManualChildren || 0,
                                             fullName: selectedUser.name,
                                             email: selectedUser.email,
                                             phone: selectedUser.phone.toString(),
                                             pricePerNight: 0, 
                                             destination: "Forest Gate Resort",
                                             pickupLocation: "Airport",
                                         };

                                         const response = await fetch(API.CreateBooking, {
                                             method: 'POST',
                                             headers: { 'Content-Type': 'application/json' },
                                             body: JSON.stringify(bookingPayload)
                                         });

                                         if (response.ok) {
                                             toast({ title: "Success", description: "Manual booking created successfully." });
                                             setIsCustomFormOpen(false);
                                             setEditData({
                                                 ...editData,
                                                 tempManualRoom: "",
                                                 tempManualCheckIn: "",
                                                 tempManualCheckOut: "",
                                                 tempManualAdults: 1,
                                                 tempManualChildren: 0,
                                                 isCustomRoom: false
                                             });
                                             // Refresh history
                                             fetchUserHistory(selectedUser.email);
                                         } else {
                                             const err = await response.json();
                                             throw new Error(err.message || "Failed to create booking");
                                         }
                                     } catch (error) {
                                         toast({ title: "Error", description: error.message, variant: "destructive" });
                                     } finally {
                                         setIsUpdating(false);
                                     }
                                 }}
                                 disabled={isUpdating}
                             >
                                 {isUpdating ? "Creating..." : "Confirm & Create Booking"}
                             </Button>
                         </div>
                     )}

                     <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                         {editData.customFields?.map((field, index) => (
                             <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm group">
                                 <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-muted-foreground uppercase">{field.key}</span>
                                     <span className="text-xs font-semibold text-gray-900">{field.value}</span>
                                 </div>
                                 <Button
                                     variant="ghost"
                                     size="icon"
                                     className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                     onClick={() => {
                                         const newFields = editData.customFields.filter((_, i) => i !== index);
                                         setEditData({...editData, customFields: newFields});
                                     }}
                                 >
                                     ✕
                                 </Button>
                             </div>
                         ))}
                         {(!editData.customFields || editData.customFields.length === 0) && (
                             <p className="text-[10px] text-muted-foreground italic text-center py-2">No custom entries added yet.</p>
                         )}
                     </div>
                 </div>
 
                 <Separator className="bg-gray-100" />

                {/* 6. User Order History */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-1 bg-blue-500 rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">User Order History</h3>
                    </div>
                    <div className="space-y-3">
                        {loadingHistory ? (
                            <div className="space-y-2">
                                <Skeleton className="h-24 w-full rounded-xl" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                        ) : userHistory.length > 0 ? (
                            userHistory.map((booking) => (
                                <div
                                    key={booking._id}
                                    onClick={() => handleHistoryItemClick(booking)}
                                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md cursor-pointer transition-all group active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{booking.bookingType || (booking.room?.roomName || "Room Booking")}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">ID: {booking._id}</p>
                                        </div>
                                        <Badge className={`${getBookingStatusColor(booking.status)} border text-[10px] px-2 py-0 h-5 shadow-none`}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="bg-gray-50 p-2 rounded-lg">
                                            <p className="text-[9px] uppercase text-muted-foreground font-bold italic">Check-In</p>
                                            <p className="text-xs font-semibold">{booking.checkIn ? format(parseISO(booking.checkIn), 'MMM dd, yyyy') : 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-lg">
                                            <p className="text-[9px] uppercase text-muted-foreground font-bold italic">Check-Out</p>
                                            <p className="text-xs font-semibold">{booking.checkOut ? format(parseISO(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex gap-3">
                                            <p className="text-[10px] text-muted-foreground">Guests: <span className="text-gray-900 font-bold">{booking.guests?.adults + (booking.guests?.children || 0) || booking.guests || 0}</span></p>
                                        </div>
                                        <p className="text-[10px] font-bold text-primary">View Full Details →</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-sm text-muted-foreground font-medium">No booking history found for this user.</p>
                            </div>
                        )}
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

      {/* Booking Detail Dialog - EDITABLE VERSION */}
      <Dialog open={isBookingDetailOpen} onOpenChange={(open) => {
          setIsBookingDetailOpen(open);
          if (!open) setIsEditingBooking(false);
      }}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
              "p-6 text-white transition-colors duration-300",
              isEditingBooking ? "bg-amber-600" : "bg-primary"
          )}>
            <div className="flex justify-between items-start">
                <div>
                    <DialogTitle className="text-2xl font-bold">
                        {isEditingBooking ? "Edit Booking Details" : "Booking Details"}
                    </DialogTitle>
                    <p className="text-white/80 text-sm">
                        {isEditingBooking ? "Modify guest info, dates, and status" : "Review specific order information"}
                    </p>
                </div>
                {!isEditingBooking && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-none"
                        onClick={() => setIsEditingBooking(true)}
                    >
                        Edit Details
                    </Button>
                )}
            </div>
          </DialogHeader>

          {tempBookingData && (
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Status & Quick Dates */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Order Status</Label>
                        {isEditingBooking ? (
                            <Select
                                value={tempBookingData.status}
                                onValueChange={(val) => setTempBookingData({...tempBookingData, status: val})}
                            >
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge className={cn("mt-1", getStatusColor(tempBookingData.status))}>
                                {tempBookingData.status}
                            </Badge>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Payment Status</Label>
                        {isEditingBooking ? (
                            <Select
                                value={tempBookingData.paymentStatus}
                                onValueChange={(val) => setTempBookingData({...tempBookingData, paymentStatus: val})}
                            >
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                                    <SelectItem value="Partial">Partial</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge variant="outline" className="mt-1 bg-white font-bold">
                                {tempBookingData.paymentStatus || 'Unpaid'}
                            </Badge>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Check-In</Label>
                        {isEditingBooking ? (
                            <Input
                                type="date"
                                className="h-9 bg-white"
                                value={tempBookingData.checkIn?.split('T')[0] || ''}
                                onChange={(e) => setTempBookingData({...tempBookingData, checkIn: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-bold pt-1">{tempBookingData.checkIn ? format(parseISO(tempBookingData.checkIn), 'MMM dd, yyyy') : 'N/A'}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Check-Out</Label>
                        {isEditingBooking ? (
                            <Input
                                type="date"
                                className="h-9 bg-white"
                                value={tempBookingData.checkOut?.split('T')[0] || ''}
                                onChange={(e) => setTempBookingData({...tempBookingData, checkOut: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-bold pt-1">{tempBookingData.checkOut ? format(parseISO(tempBookingData.checkOut), 'MMM dd, yyyy') : 'N/A'}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Destination</Label>
                        {isEditingBooking ? (
                            <Input
                                className="h-9 bg-white"
                                value={tempBookingData.destination || "Forest Gate Resort"}
                                onChange={(e) => setTempBookingData({...tempBookingData, destination: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-bold pt-1">{tempBookingData.destination || "Forest Gate Resort"}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Pickup Location</Label>
                        {isEditingBooking ? (
                            <Input
                                className="h-9 bg-white"
                                value={tempBookingData.pickupLocation || "Airport"}
                                onChange={(e) => setTempBookingData({...tempBookingData, pickupLocation: e.target.value})}
                            />
                        ) : (
                            <p className="text-sm font-bold pt-1">{tempBookingData.pickupLocation || "Airport"}</p>
                        )}
                    </div>
                </div>

                {tempBookingData.status?.toLowerCase() === 'cancelled' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Cancellation Details</h4>
                        </div>
                        <div className="space-y-2">
                            {tempBookingData.cancellationReasons?.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground italic">Reasons</p>
                                    <div className="flex flex-wrap gap-1">
                                        {tempBookingData.cancellationReasons.map((reason, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px] bg-white text-destructive border-destructive/20 h-5">
                                                {reason}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {tempBookingData.cancellationNote && (
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground italic">Additional Note</p>
                                    <p className="text-xs font-semibold italic text-destructive leading-relaxed">"{tempBookingData.cancellationNote}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Guest Profiles */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                             Guest Profiles
                        </h4>
                        {isEditingBooking && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] gap-1 px-2 border-dashed"
                                onClick={() => {
                                    const guests = [...(tempBookingData.guestDetails || [])];
                                    guests.push({ name: "", gender: "Male", age: "", type: "adult" });
                                    setTempBookingData({...tempBookingData, guestDetails: guests});
                                }}
                            >
                                + Add Guest
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {tempBookingData.guestDetails?.map((guest, idx) => (
                            <div key={idx} className="relative p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                                {isEditingBooking ? (
                                    <div className="grid grid-cols-12 gap-3 pt-2">
                                        <div className="col-span-5 space-y-1">
                                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Name</Label>
                                            <Input
                                                className="h-8 text-xs bg-white"
                                                value={guest.name}
                                                onChange={(e) => {
                                                    const details = [...tempBookingData.guestDetails];
                                                    details[idx].name = e.target.value;
                                                    setTempBookingData({...tempBookingData, guestDetails: details});
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Gender</Label>
                                            <Select
                                                value={guest.gender}
                                                onValueChange={(val) => {
                                                    const details = [...tempBookingData.guestDetails];
                                                    details[idx].gender = val;
                                                    setTempBookingData({...tempBookingData, guestDetails: details});
                                                }}
                                            >
                                                <SelectTrigger className="h-8 text-xs bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Age</Label>
                                            <Input
                                                className="h-8 text-xs bg-white"
                                                value={guest.age}
                                                onChange={(e) => {
                                                    const details = [...tempBookingData.guestDetails];
                                                    details[idx].age = e.target.value;
                                                    setTempBookingData({...tempBookingData, guestDetails: details});
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-[9px] uppercase font-bold text-muted-foreground">Type</Label>
                                            <Select
                                                value={guest.type}
                                                onValueChange={(val) => {
                                                    const details = [...tempBookingData.guestDetails];
                                                    details[idx].type = val;
                                                    setTempBookingData({...tempBookingData, guestDetails: details});
                                                }}
                                            >
                                                <SelectTrigger className="h-8 text-xs bg-white px-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="adult">Adult</SelectItem>
                                                    <SelectItem value="child">Child</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-sm border border-gray-100 rounded-full text-muted-foreground hover:text-destructive transition-transform group-hover:scale-110"
                                            onClick={() => {
                                                const details = tempBookingData.guestDetails.filter((_, i) => i !== idx);
                                                setTempBookingData({...tempBookingData, guestDetails: details});
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{guest.name || "Unnamed Guest"}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase">{guest.type} • {guest.gender} • {guest.age || 'N/A'} Years</span>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] h-5 bg-white">{guest.type}</Badge>
                                    </div>
                                )}
                            </div>
                        ))}

                        {(!tempBookingData.guestDetails || tempBookingData.guestDetails.length === 0) && (
                            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-blue-900">Legacy Guest Format</p>
                                    <p className="text-[10px] text-blue-700/70">Using simple counts instead of full profiles.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <p className="text-[8px] uppercase font-bold text-blue-400">Adults</p>
                                        <p className="text-sm font-bold text-blue-900">{tempBookingData.guests?.adults || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[8px] uppercase font-bold text-blue-400">Children</p>
                                        <p className="text-sm font-bold text-blue-900">{tempBookingData.guests?.children || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                 {/* Add-ons Manager */}
                 <div className="space-y-4 pt-2 border-t border-gray-100">
                     <div className="flex justify-between items-center">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                              Additional Add-ons
                         </h4>
                         {isEditingBooking && (
                             <Button
                                 variant="outline"
                                 size="sm"
                                 className="h-7 text-[10px] gap-1 px-2 border-dashed"
                                 onClick={() => {
                                     const adds = [...(tempBookingData.addons || [])];
                                     adds.push({ name: "", price: 0, status: "active" });
                                     setTempBookingData({...tempBookingData, addons: adds});
                                 }}
                             >
                                 + Add Extra
                             </Button>
                         )}
                     </div>
 
                     <div className="grid grid-cols-1 gap-2">
                         {tempBookingData.addons?.map((addon, idx) => (
                             <div key={idx} className={cn(
                                 "relative flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-white",
                                 addon.status === "cancelled" ? "bg-red-50/50 border-red-100" : "bg-gray-50/50 border-gray-100"
                             )}>
                                 {isEditingBooking ? (
                                     <div className="flex items-center gap-3 w-full">
                                         <div className="flex-1 space-y-1">
                                             <Label className="text-[8px] uppercase font-bold text-muted-foreground">Add-on Name</Label>
                                             <Input
                                                 className={cn("h-8 text-xs bg-white", addon.status === "cancelled" && "text-red-600 line-through")}
                                                 placeholder="e.g. Extra Bed"
                                                 value={addon.name}
                                                 onChange={(e) => {
                                                     const adds = [...tempBookingData.addons];
                                                     adds[idx].name = e.target.value;
                                                     setTempBookingData({...tempBookingData, addons: adds});
                                                 }}
                                             />
                                         </div>
                                         <div className="w-24 space-y-1">
                                             <Label className="text-[8px] uppercase font-bold text-muted-foreground">Price (₹)</Label>
                                             <Input
                                                 type="number"
                                                 className={cn("h-8 text-xs bg-white text-right font-bold", addon.status === "cancelled" ? "text-red-500 line-through" : "text-primary")}
                                                 value={addon.price}
                                                 onChange={(e) => {
                                                     const adds = [...tempBookingData.addons];
                                                     adds[idx].price = Number(e.target.value);
                                                     setTempBookingData({...tempBookingData, addons: adds});
                                                 }}
                                             />
                                         </div>
                                         <div className="flex gap-1 mt-3">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn("h-6 w-6", addon.status === "cancelled" ? "text-emerald-600 hover:text-emerald-700" : "text-amber-600 hover:text-amber-700")}
                                                title={addon.status === "cancelled" ? "Restore Add-on" : "Cancel Add-on"}
                                                onClick={() => {
                                                    const adds = [...tempBookingData.addons];
                                                    adds[idx].status = addon.status === "cancelled" ? "active" : "cancelled";
                                                    setTempBookingData({...tempBookingData, addons: adds});
                                                }}
                                            >
                                                {addon.status === "cancelled" ? "↺" : "⊘"}
                                            </Button>
                                            
                                            {/* Delete only for NEW unsaved entries */}
                                            {!addon._id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                    onClick={() => {
                                                        const adds = tempBookingData.addons.filter((_, i) => i !== idx);
                                                        setTempBookingData({...tempBookingData, addons: adds});
                                                    }}
                                                >
                                                    ✕
                                                </Button>
                                            )}
                                         </div>
                                     </div>
                                 ) : (
                                     <div className="flex justify-between items-center w-full">
                                         <span className={cn("text-xs font-semibold", addon.status === "cancelled" ? "text-red-600 line-through" : "text-gray-700")}>
                                             {addon.name}
                                         </span>
                                         <div className="flex items-center gap-2">
                                             <span className={cn("text-xs font-bold", addon.status === "cancelled" ? "text-red-500 line-through" : "text-gray-900")}>
                                                 ₹{(addon.price || 0).toLocaleString()}
                                             </span>
                                             {addon.status === "cancelled" && (
                                                 <Badge variant="outline" className="text-[8px] h-4 bg-red-50 text-red-600 border-red-200 leading-none px-1">Cancelled</Badge>
                                             )}
                                         </div>
                                     </div>
                                 )}
                             </div>
                         ))}
                         {(!tempBookingData.addons || tempBookingData.addons.length === 0) && (
                             <p className="text-[10px] text-muted-foreground italic pl-1">No additional add-ons.</p>
                         )}
                     </div>
                 </div>

                 {/* Notes & Special Requests */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Special Requests</Label>
                        {isEditingBooking ? (
                            <Textarea
                                className="min-h-[100px] text-xs resize-none bg-amber-50/30 border-amber-100 focus:border-amber-300 transition-colors"
                                value={tempBookingData.specialRequest || ''}
                                onChange={(e) => setTempBookingData({...tempBookingData, specialRequest: e.target.value})}
                                placeholder="Enter guest special requests..."
                            />
                        ) : (
                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 min-h-[100px]">
                                <p className="text-xs text-amber-900 leading-relaxed font-medium italic">
                                    {tempBookingData.specialRequest ? `"${tempBookingData.specialRequest}"` : "No special requests."}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Internal Admin Notes</Label>
                        {isEditingBooking ? (
                            <Textarea
                                className="min-h-[100px] text-xs resize-none bg-blue-50/30 border-blue-100 focus:border-blue-300 transition-colors"
                                value={tempBookingData.notes || ''}
                                onChange={(e) => setTempBookingData({...tempBookingData, notes: e.target.value})}
                                placeholder="Enter private admin remarks..."
                            />
                        ) : (
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 min-h-[100px]">
                                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                    {tempBookingData.notes || "No internal notes added."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Financial Footer */}
                {/* Financial Footer (Dynamic) */}
                {(() => {
                    const checkIn = new Date(tempBookingData.checkIn);
                    const checkOut = new Date(tempBookingData.checkOut);
                    const nights = Math.max(0, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
                    const basePrice = (nights * (tempBookingData.pricePerNight || 0));
                    const addonsTotal = (tempBookingData.addons || []).reduce((sum, a) => {
                        if (a.status === "cancelled") return sum;
                        return sum + (Number(a.price) || 0);
                    }, 0);
                    const totalAmount = basePrice + addonsTotal;

                    return (
                        <div className={`p-5 rounded-3xl shadow-lg relative overflow-hidden group transition-all duration-300 ${isEditingBooking ? 'bg-primary/5 border border-primary/20' : 'bg-gray-900 text-white'}`}>
                            {isEditingBooking ? (
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Pricing Calculation</p>
                                        <Badge className="bg-primary/10 text-primary border-none text-[10px]">{nights} Nights</Badge>
                                    </div>
                                    <div className="space-y-1 text-xs font-medium">
                                        <div className="flex justify-between opacity-70">
                                            <span>Base Stay ({nights} x ₹{tempBookingData.pricePerNight})</span>
                                            <span>₹{basePrice.toLocaleString()}</span>
                                        </div>
                                        {addonsTotal > 0 && (
                                            <>
                                                <div className="space-y-1 mt-2 mb-1 border-t border-primary/10 pt-1">
                                                    {(tempBookingData.addons || []).filter(a => a.status !== "cancelled").map((addon, i) => (
                                                        <div key={i} className="flex justify-between opacity-60 text-[10px]">
                                                            <span>+ {addon.name}</span>
                                                            <span>₹{(addon.price || 0).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between opacity-80 font-bold">
                                                    <span>Add-ons Total</span>
                                                    <span>₹{addonsTotal.toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-primary/20 font-black text-sm text-primary">
                                            <span>Dynamic Total</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Total Pricing</p>
                                            <p className="text-2xl font-black text-white">₹{tempBookingData.totalAmount?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1">Stay Duration</p>
                                            <p className="text-sm font-bold text-primary-foreground">{tempBookingData.totalNights || 0} Nights</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })()}
            </div>
          )}

          <div className="p-6 bg-gray-50 border-t flex items-center justify-between gap-3">
             {isEditingBooking ? (
                 <div className="flex gap-3 w-full">
                    <Button
                        variant="ghost"
                        className="flex-1 rounded-xl h-11 font-bold text-muted-foreground"
                        onClick={() => setIsEditingBooking(false)}
                        disabled={isUpdatingBooking}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-2 w-full max-w-[200px] rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
                        onClick={handleUpdateBooking}
                        disabled={isUpdatingBooking}
                    >
                        {isUpdatingBooking ? "Saving..." : "Save Changes"}
                    </Button>
                 </div>
             ) : (
                 <>
                    <Button
                        variant="destructive"
                        className="rounded-xl h-11 px-6 font-bold bg-red-50 text-red-600 border-none hover:bg-red-100 shadow-none transition-colors"
                        onClick={() => setIsBookingDeleteDialogOpen(true)}
                    >
                        Delete Booking
                    </Button>
                    <Button
                        className="flex-1 rounded-xl h-11 font-bold shadow-md"
                        onClick={() => setIsBookingDetailOpen(false)}
                    >
                        Close Details
                    </Button>
                 </>
             )}
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Delete Booking Confirmation */}
      <AlertDialog open={isBookingDeleteDialogOpen} onOpenChange={setIsBookingDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this booking record? This action is permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDeleteBooking} 
                className="bg-destructive text-white hover:bg-destructive/90"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

}
