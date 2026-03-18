'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { API } from '@/lib/api/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MoreHorizontal, Eye, CheckCircle, XCircle, AlertCircle, ThumbsUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminOrdersPage() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(API.GetBooking);
        const data = await response.json();
        // Assuming the API returns { bookings: [...] } or just an array
        const fetchedBookings = Array.isArray(data) ? data : data.bookings || [];
        // Map the properties if needed, or just set them if they match the backend
        const mappedBookings = fetchedBookings.map(b => ({
            ...b,
            status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Upcoming'
        }));
        setBookingsList(mappedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bookings.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Upcoming':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(API.UpdateBookingStatus(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
         throw new Error("Failed to update status");
      }

      setBookingsList(prev => prev.map(b => (b._id || b.id) === id ? { ...b, status: newStatus } : b));
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      });
    } catch (error) {
       console.error(error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update booking status.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Manage Orders</h1>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Guest Bookings</CardTitle>
              <CardDescription>View and manage all reservations made by guests.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">Loading bookings...</TableCell>
                            </TableRow>
                        ) : bookingsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">No bookings found.</TableCell>
                            </TableRow>
                        ) : bookingsList.map((booking) => (
                            <TableRow key={booking._id || booking.id}>
                                <TableCell className="font-medium">
                                    {booking._id ? booking._id.substring(0, 8) : booking.id}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{booking.fullName || booking.userName}</div>
                                    <div className="text-sm text-muted-foreground">{booking.email || booking.userEmail}</div>
                                </TableCell>
                                <TableCell>{booking.bookingType}</TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground">In: {booking.checkIn ? format(parseISO(booking.checkIn), 'MMM dd, yyyy') : 'N/A'}</div>
                                    <div className="text-xs text-muted-foreground">Out: {booking.checkOut ? format(parseISO(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}</div>
                                </TableCell>
                                <TableCell>₹{booking.totalAmount?.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(booking.status || 'Upcoming')}>
                                        {booking.status || 'Upcoming'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => updateStatus(booking._id || booking.id, 'confirmed')}>
                                                <ThumbsUp className="mr-2 h-4 w-4 text-green-600" /> Confirm Booking
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(booking._id || booking.id, 'completed')}>
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" /> Mark Completed
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(booking._id || booking.id, 'cancelled')}>
                                                <XCircle className="mr-2 h-4 w-4 text-destructive" /> Cancel Booking
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
          </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={(isOpen) => !isOpen && setSelectedBooking(null)}>
            <DialogContent className="sm:max-w-[625px]">
            {selectedBooking && (
                <>
                <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                    Full information for booking ID: {selectedBooking._id || selectedBooking.id}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Guest Name</p>
                        <p className="font-medium">{selectedBooking.fullName || selectedBooking.userName}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Guest Email</p>
                        <p className="font-medium">{selectedBooking.email || selectedBooking.userEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Guest Phone</p>
                        <p className="font-medium">{selectedBooking.phone || "N/A"}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Destination</p>
                        <p className="font-medium">{selectedBooking.destination || "Forest Gate Resort"}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Pickup Location</p>
                        <p className="font-medium">{selectedBooking.pickupLocation || "Airport"}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Accommodation</p>
                        <p className="font-medium">{selectedBooking.bookingType}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Stay Dates</p>
                        <p className="font-medium">
                            {selectedBooking.checkIn ? format(parseISO(selectedBooking.checkIn), 'MMM dd') : 'N/A'} - {selectedBooking.checkOut ? format(parseISO(selectedBooking.checkOut), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                    </div>
                     <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Number of Guests</p>
                        <p className="font-medium">
                            {selectedBooking.guests?.adults || 0} Adults, {selectedBooking.guests?.children || 0} Children
                        </p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="font-bold text-xl">₹{selectedBooking.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Current Status</p>
                        <Badge variant={getBadgeVariant(selectedBooking.status || 'Upcoming')} className="w-fit">
                            {selectedBooking.status || 'Upcoming'}
                        </Badge>
                    </div>

                    {selectedBooking.status?.toLowerCase() === 'cancelled' && (
                        <>
                            <Separator />
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg space-y-3 text-red-900">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-xs font-black uppercase tracking-widest">Cancellation Details</p>
                                </div>
                                {selectedBooking.cancelledAt && (
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <p className="text-[10px] font-bold text-red-900/60 uppercase">Date Cancelled</p>
                                        <p className="text-xs font-medium">
                                            {format(parseISO(selectedBooking.cancelledAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] font-bold text-red-900/60 uppercase mb-1">Reasons</p>
                                    {selectedBooking.cancellationReasons?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {selectedBooking.cancellationReasons.map((reason, i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] bg-white text-red-700 border-red-200">
                                                    {reason}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-red-700/60 italic">No reasons provided.</p>
                                    )}
                                </div>
                                {selectedBooking.cancellationNote && (
                                    <div>
                                        <p className="text-[10px] font-bold text-red-900/60 uppercase mb-1">Additional Note</p>
                                        <p className="text-xs bg-white/60 border border-red-100 p-2 rounded-md italic">"{selectedBooking.cancellationNote}"</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="flex justify-between items-center w-full">
                    <Button type="button" variant="outline" onClick={() => {
                        const params = new URLSearchParams();
                        params.append("bookingType", selectedBooking.bookingType || "Room");
                        params.append("fullName", selectedBooking.fullName || selectedBooking.userName);
                        params.append("email", selectedBooking.email || selectedBooking.userEmail);
                        params.append("checkIn", selectedBooking.checkIn);
                        params.append("checkOut", selectedBooking.checkOut);
                        params.append("guests", (selectedBooking.guests?.adults + (selectedBooking.guests?.children || 0)).toString());
                        params.append("totalPrice", selectedBooking.totalAmount?.toString() || "0");
                        params.append("roomName", selectedBooking.roomName || selectedBooking.bookingType);
                        params.append("numAdults", selectedBooking.guests?.adults?.toString() || "0");
                        params.append("numChildren", selectedBooking.guests?.children?.toString() || "0");
                        params.append("bookingId", selectedBooking._id || selectedBooking.id);
                        
                        window.open(`/booking/confirmation?${params.toString()}`, '_blank');
                    }}>
                        Generate Invoice
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setSelectedBooking(null)}>
                        Close
                    </Button>
                </DialogFooter>
                </>
            )}
            </DialogContent>
      </Dialog>
    </div>
  );
}
