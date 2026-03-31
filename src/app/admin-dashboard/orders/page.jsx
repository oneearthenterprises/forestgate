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
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Eye, CheckCircle, XCircle, AlertCircle, ThumbsUp, DoorOpen, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination-nav';

export default function AdminOrdersPage() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // ── Assign Room state ──
  const [assignRoomBooking, setAssignRoomBooking] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [customRoomName, setCustomRoomName] = useState('');
  const [isSavingRoom, setIsSavingRoom] = useState(false);

  // ── Admin Cancel with Reason state ──
  const [cancelTargetBooking, setCancelTargetBooking] = useState(null);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [cancelNote, setCancelNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const ADMIN_CANCEL_REASONS = [
    'Room no longer available',
    'Overbooking / scheduling conflict',
    'Guest did not complete payment',
    'Policy violation',
    'Force majeure / property closure',
    'Administrative decision',
  ];

  const toggleCancelReason = (reason) => {
    setCancelReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleAdminCancel = async () => {
    if (!cancelTargetBooking) return;
    const id = cancelTargetBooking._id || cancelTargetBooking.id;
    setIsCancelling(true);
    try {
      const res = await fetch(API.CancelBooking(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancellationReasons: cancelReasons,
          cancellationNote: cancelNote,
        }),
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      setBookingsList(prev =>
        prev.map(b => (b._id || b.id) === id ? { ...b, status: 'Cancelled' } : b)
      );
      if (selectedBooking && (selectedBooking._id || selectedBooking.id) === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'cancelled', cancellationReasons: cancelReasons, cancellationNote: cancelNote, cancelledAt: new Date().toISOString() }));
      }
      toast({ title: '🚫 Booking Cancelled', description: 'Cancellation reason has been saved and sent to the guest.' });
      setCancelTargetBooking(null);
      setCancelReasons([]);
      setCancelNote('');
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not cancel booking. Please try again.' });
    } finally {
      setIsCancelling(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch a larger set for export (e.g., 1000)
      const response = await fetch(`${API.GetBooking}?page=1&limit=1000`);
      const data = await response.json();
      const allBookings = data.bookings || [];

      if (allBookings.length === 0) {
        toast({ title: "No data to export", description: "There are no bookings to download." });
        return;
      }

      // Define CSV headers
      const headers = [
        "Booking ID",
        "Guest Name",
        "Guest Email",
        "Room/Type",
        "Check-In",
        "Check-Out",
        "Total Price",
        "Status",
        "Payment Status",
        "Created At"
      ];

      // Map data to rows
      const rows = allBookings.map(b => {
        const checkIn = b.checkIn ? format(parseISO(b.checkIn), 'yyyy-MM-dd') : 'N/A';
        const checkOut = b.checkOut ? format(parseISO(b.checkOut), 'yyyy-MM-dd') : 'N/A';
        const createdAt = b.createdAt ? format(parseISO(b.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A';
        const roomName = b.allocation && b.allocation.length > 0 
          ? b.allocation.map(a => a.name).join("; ") 
          : (b.roomName || b.bookingType || 'N/A');

        return [
          b.bookingId || b._id,
          b.fullName || b.userName || 'N/A',
          b.email || b.userEmail || 'N/A',
          `"${roomName}"`, // Quote to handle semicolons/commas
          checkIn,
          checkOut,
          b.totalAmount || 0,
          b.status || 'Upcoming',
          b.paymentStatus || 'Unpaid',
          createdAt
        ];
      });

      // Combine into CSV string
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `forest_gate_bookings_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export Successful", description: `Exported ${allBookings.length} bookings to CSV.` });
    } catch (error) {
      console.error("Export failed:", error);
      toast({ variant: "destructive", title: "Export Failed", description: "An error occurred while generating the CSV." });
    } finally {
      setIsExporting(false);
    }
  };


  // Fetch bookings
  const fetchBookings = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API.GetBooking}?page=${page}&limit=10`);
      const data = await response.json();
      
      const fetchedBookings = data.bookings || [];
      const mappedBookings = fetchedBookings.map(b => ({
          ...b,
          status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Upcoming'
      }));
      
      setBookingsList(mappedBookings);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || page);
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

  // Fetch all rooms for assignment dialog
  const fetchAllRooms = async () => {
    try {
      const res = await fetch(API.GetAllRooms);
      const data = await res.json();
      setAllRooms(data.rooms || data || []);
    } catch (e) {
      console.error('Error fetching rooms:', e);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
    fetchAllRooms();
  }, [currentPage]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Upcoming':  return 'secondary';
      case 'Cancelled': return 'destructive';
      default:          return 'outline';
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(API.UpdateBookingStatus(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setBookingsList(prev => prev.map(b => (b._id || b.id) === id ? { ...b, status: newStatus } : b));
      toast({ title: "Status Updated", description: `Booking status changed to ${newStatus}.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not update booking status." });
    }
  };

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    try {
      const response = await fetch(API.UpdateBooking(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      const data = await response.json();
      setBookingsList(prev => prev.map(b => (b._id || b.id) === id ? { ...b, paymentStatus: newPaymentStatus } : b));
      if (selectedBooking && (selectedBooking._id || selectedBooking.id) === id) {
          setSelectedBooking(data.booking);
      }
      toast({ title: "Payment Status Updated", description: `Booking payment status changed to ${newPaymentStatus}.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not update payment status." });
    }
  };

  // ── Open Assign Room Dialog ──
  const openAssignRoom = (booking) => {
    setAssignRoomBooking(booking);
    // Pre-fill current assignment if any
    const currentRoomId = booking.room?._id || booking.room || '';
    setSelectedRoomId(currentRoomId);
    setCustomRoomName('');
  };

  // ── Save Room Assignment ──
  const handleSaveRoomAssignment = async () => {
    if (!assignRoomBooking) return;
    const bookingId = assignRoomBooking._id || assignRoomBooking.id;

    let roomId = null;
    let roomName = '';

    if (selectedRoomId === 'custom') {
      roomName = customRoomName.trim();
      if (!roomName) {
        toast({ variant: 'destructive', title: 'Please enter a room name.' });
        return;
      }
    } else if (selectedRoomId) {
      const found = allRooms.find(r => r._id === selectedRoomId);
      roomId = selectedRoomId;
      roomName = found ? found.roomName : '';
    } else {
      toast({ variant: 'destructive', title: 'Please select a room.' });
      return;
    }

    setIsSavingRoom(true);
    try {
      const payload = { roomName };
      if (roomId) payload.room = roomId;

      const res = await fetch(API.UpdateBooking(bookingId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to assign room');

      const data = await res.json();
      const updated = data.booking;

      setBookingsList(prev =>
        prev.map(b => (b._id || b.id) === bookingId ? { ...b, roomName: updated.roomName, room: updated.room } : b)
      );

      if (selectedBooking && (selectedBooking._id || selectedBooking.id) === bookingId) {
        setSelectedBooking(updated);
      }

      toast({ title: '✅ Room Assigned', description: `Room "${roomName}" assigned successfully.` });
      setAssignRoomBooking(null);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not assign room. Please try again.' });
    } finally {
      setIsSavingRoom(false);
    }
  };

  const statusColors = {
    'Paid':           'bg-green-100 text-green-700 border-green-200',
    'Unpaid':         'bg-red-100 text-red-700 border-red-200',
    'Partially Paid': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Manage Orders</h1>
        <Button 
          variant="outline" 
          onClick={handleExportCSV} 
          disabled={isExporting || bookingsList.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
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
                            <TableHead>Room / Type</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">Loading bookings...</TableCell>
                            </TableRow>
                        ) : bookingsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">No bookings found.</TableCell>
                            </TableRow>
                        ) : bookingsList.map((booking) => {
                            const nights = Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)));
                            const hasAlloc = booking.allocation && booking.allocation.length > 0;

                            // Always recalculate with discount+GST when allocation is present
                            const allocBase = hasAlloc
                                ? booking.allocation.reduce((sum, r) => sum + (Number(r.price) || 0), 0) * nights
                                : Number(booking.pricePerNight || 0) * nights;
                            const addonsTotal = (booking.addons || []).filter(a => a.status !== 'cancelled').reduce((s, a) => s + (Number(a.price) || 0), 0);
                            const afterDisc = Math.round(allocBase * 0.90);
                            const withGst = Math.round(afterDisc * 1.18);
                            const dynamicTotal = hasAlloc
                                ? (withGst + addonsTotal)                            // allocation present → fresh calculation
                                : (Number(booking.totalAmount) || withGst + addonsTotal); // no allocation → stored value
                            return (
                            <TableRow key={booking._id || booking.id}>
                                <TableCell className="font-medium">
                                    {booking.bookingId || (booking._id ? booking._id.substring(0, 8) : booking.id)}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{booking.fullName || booking.userName}</div>
                                    <div className="text-sm text-muted-foreground">{booking.email || booking.userEmail}</div>
                                </TableCell>
                                <TableCell>
                                    {hasAlloc ? (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-sm">
                                                {booking.allocation[0].name}
                                                {booking.allocation.length > 1 && (
                                                    <span className="text-xs text-blue-600 ml-1">+{booking.allocation.length - 1} more</span>
                                                )}
                                            </span>
                                            {booking.bookingType && (
                                                <span className="text-xs text-muted-foreground">{booking.bookingType}</span>
                                            )}
                                        </div>
                                    ) : booking.roomName ? (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-sm">{booking.roomName}</span>
                                            {booking.bookingType && (
                                                <span className="text-xs text-muted-foreground">{booking.bookingType}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">{booking.bookingType || '—'}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground">In: {booking.checkIn ? format(parseISO(booking.checkIn), 'MMM dd, yyyy') : 'N/A'}</div>
                                    <div className="text-xs text-muted-foreground">Out: {booking.checkOut ? format(parseISO(booking.checkOut), 'MMM dd, yyyy') : 'N/A'}</div>
                                </TableCell>
                                <TableCell>₹{dynamicTotal.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(booking.status || 'Upcoming')}>
                                        {booking.status || 'Upcoming'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={statusColors[booking.paymentStatus || 'Unpaid']}>
                                        {booking.paymentStatus || 'Unpaid'}
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
                                            <DropdownMenuItem onClick={() => { setCancelTargetBooking(booking); setCancelReasons([]); setCancelNote(''); }} className="text-destructive focus:text-destructive">
                                                <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Payment Status</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => updatePaymentStatus(booking._id || booking.id, 'Paid')}>
                                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Mark as Paid
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updatePaymentStatus(booking._id || booking.id, 'Unpaid')}>
                                                <XCircle className="mr-2 h-4 w-4 text-red-600" /> Mark as Unpaid
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-4"
              />
          </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={(isOpen) => !isOpen && setSelectedBooking(null)}>
            <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
            {selectedBooking && (() => {
                const nights = Math.max(1, Math.ceil((new Date(selectedBooking.checkOut) - new Date(selectedBooking.checkIn)) / (1000 * 60 * 60 * 24)));
                const hasAlloc = selectedBooking.allocation && selectedBooking.allocation.length > 0;
                const addonsSum = (selectedBooking.addons || []).filter(a => a.status !== "cancelled").reduce((s, a) => s + (Number(a.price) || 0), 0);

                // Always recalculate with discount+GST when allocation is present
                const allocBase = hasAlloc
                    ? selectedBooking.allocation.reduce((sum, r) => sum + (Number(r.price) || 0), 0) * nights
                    : Number(selectedBooking.pricePerNight || 0) * nights;
                const afterDisc = Math.round(allocBase * 0.90);
                const withGst = Math.round(afterDisc * 1.18);
                const finalTotal = hasAlloc
                    ? (withGst + addonsSum)
                    : (Number(selectedBooking.totalAmount) || withGst + addonsSum);
                const staySum = finalTotal - addonsSum;
                
                const roomImages = selectedBooking.room?.images;
                const imageUrl = roomImages?.[0]?.url;
                const roomLabel = hasAlloc 
                    ? selectedBooking.allocation.map(r => r.name).join(", ")
                    : (selectedBooking.roomName || selectedBooking.bookingType || 'Forest Gate Resort');

                return (
                <>
                {/* ── Room Image Banner ── */}
                <div className="relative w-full h-44 shrink-0 overflow-hidden">
                    {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={roomLabel}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {/* Room label + guest name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-end justify-between">
                        <div>
                        <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-0.5">Booked Room</p>
                        <p className="text-xl font-bold leading-tight">{roomLabel}</p>
                        </div>
                        <div className="text-right">
                        <p className="text-xs text-white/70">Guest</p>
                        <p className="text-sm font-semibold">{selectedBooking.fullName || selectedBooking.userName}</p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1 px-6 pb-6">
                <DialogHeader className="pt-5 pb-0">
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                    Full information for booking ID: {selectedBooking.bookingId || selectedBooking._id || selectedBooking.id}
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

                    {/* ── Assigned Room Row ── */}
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Assigned Room(s)</p>
                        <div className="flex flex-wrap gap-1.5">
                            {hasAlloc ? (
                                selectedBooking.allocation.map((alloc, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs">
                                        <DoorOpen className="h-3 w-3" />
                                        {alloc.name} (₹{Number(alloc.price).toLocaleString()})
                                    </span>
                                ))
                            ) : selectedBooking.roomName ? (
                                <span className="inline-flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-sm w-fit">
                                    <DoorOpen className="h-3.5 w-3.5" />
                                    {selectedBooking.roomName}
                                </span>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Not yet assigned</p>
                            )}
                        </div>
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
                    {selectedBooking.addons?.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <p className="text-sm font-semibold">Additional Add-ons</p>
                                {selectedBooking.addons.filter(a => a.status !== "cancelled").map((addon, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <p className="text-muted-foreground">{addon.name}</p>
                                        <p className="font-medium">₹{(addon.price || 0).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <Separator />
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Stay Total ({nights} Nights)</p>
                        <p className="font-semibold text-lg">₹{staySum.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Final Total Amount</p>
                        <p className="font-bold text-xl text-primary">₹{finalTotal.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <Badge className={`${statusColors[selectedBooking.paymentStatus || 'Unpaid']} w-fit`}>
                            {selectedBooking.paymentStatus || 'Unpaid'}
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
                    {selectedBooking.paymentStatus === "Paid" && (
                        <Button type="button" variant="outline" onClick={() => {
                            const params = new URLSearchParams();
                            params.append("bookingType", selectedBooking.bookingType || "Room");
                            params.append("fullName", selectedBooking.fullName || selectedBooking.userName);
                            params.append("email", selectedBooking.email || selectedBooking.userEmail);
                            params.append("checkIn", selectedBooking.checkIn);
                            params.append("checkOut", selectedBooking.checkOut);
                            params.append("guests", (selectedBooking.guests?.adults + (selectedBooking.guests?.children || 0)).toString());
                            params.append("totalPrice", finalTotal.toString());
                            params.append("roomName", selectedBooking.roomName || selectedBooking.bookingType);
                            params.append("numAdults", selectedBooking.guests?.adults?.toString() || "0");
                            params.append("numChildren", selectedBooking.guests?.children?.toString() || "0");
                            params.append("bookingId", selectedBooking.bookingId || selectedBooking._id || selectedBooking.id);
                            if (selectedBooking.addons?.length > 0) {
                                params.append("addons", JSON.stringify(selectedBooking.addons));
                            }
                            if (selectedBooking.allocation) {
                                params.append("allocation", JSON.stringify(selectedBooking.allocation));
                            }
                            if (selectedBooking.guestDetails?.length > 0) {
                                params.append("guestDetails", JSON.stringify(selectedBooking.guestDetails));
                            }
                            if (selectedBooking.specialRequests) {
                                params.append("specialRequests", selectedBooking.specialRequests);
                            }
                            if (selectedBooking.internalNotes) {
                                params.append("internalNotes", selectedBooking.internalNotes);
                            }
                            const baseUrl = window.location.origin;
                            window.open(`/booking/confirmation?${params.toString()}`, '_blank');
                        }}>
                            Generate Invoice
                        </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={() => setSelectedBooking(null)}>
                        Close
                    </Button>
                </DialogFooter>
                </div>{/* end scrollable body */}
                </>
                );
            })()}
            </DialogContent>
      </Dialog>

      {/* ── Admin Cancel with Reason Dialog ── */}
      <Dialog open={!!cancelTargetBooking} onOpenChange={(open) => { if (!open) { setCancelTargetBooking(null); setCancelReasons([]); setCancelNote(''); } }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Cancelling booking for{' '}
              <span className="font-semibold text-foreground">
                {cancelTargetBooking?.fullName || cancelTargetBooking?.userName}
              </span>
              {cancelTargetBooking?.bookingId && (
                <span className="text-xs text-muted-foreground ml-1">(#{cancelTargetBooking.bookingId})</span>
              )}
              . The reason will be shown to the guest in their booking history.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-4">
            {/* Reason checkboxes */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Reason(s)</p>
              <div className="space-y-2">
                {ADMIN_CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors select-none ${
                      cancelReasons.includes(reason)
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-muted/30 border-transparent hover:border-gray-200 hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-red-500 h-4 w-4 shrink-0"
                      checked={cancelReasons.includes(reason)}
                      onChange={() => toggleCancelReason(reason)}
                    />
                    <span className="text-sm font-medium">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional note */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Note (Optional)</p>
              <Textarea
                placeholder="Add any additional details for the guest..."
                className="resize-none min-h-[80px] text-sm"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setCancelTargetBooking(null); setCancelReasons([]); setCancelNote(''); }} disabled={isCancelling}>
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleAdminCancel}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling…' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Assign Room Dialog ── */}

      <Dialog open={!!assignRoomBooking} onOpenChange={(isOpen) => !isOpen && setAssignRoomBooking(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-blue-600" />
              Assign Room
            </DialogTitle>
            <DialogDescription>
              Assign a room to{' '}
              <span className="font-semibold text-foreground">
                {assignRoomBooking?.fullName || assignRoomBooking?.userName}
              </span>
              {assignRoomBooking?.bookingId && (
                <span className="text-xs text-muted-foreground ml-1">
                  (#{assignRoomBooking.bookingId})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-4">

            {/* ── Guest's Originally Booked Room ── */}
            {(() => {
              const bookedRoom = allRooms.find(
                r => r._id === (assignRoomBooking?.room?._id || assignRoomBooking?.room)
              ) || (assignRoomBooking?.roomName ? { roomName: assignRoomBooking.roomName, _id: null } : null);

              if (!bookedRoom) return (
                <p className="text-sm text-muted-foreground italic text-center py-2">
                  No room was selected by the guest at booking time.
                </p>
              );

              const isThisAlreadyAssigned = assignRoomBooking?.roomName === bookedRoom.roomName;
              const bookedRoomImage = bookedRoom.images?.[0]?.url;

              return (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    🛎 Guest's Requested Room
                  </p>
                  <div className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                    selectedRoomId === (bookedRoom._id || 'booked')
                      ? 'border-blue-500 shadow-md shadow-blue-100'
                      : 'border-blue-200'
                  }`}>
                    {/* Room Image */}
                    {bookedRoomImage ? (
                      <img src={bookedRoomImage} alt={bookedRoom.roomName} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center">
                        <DoorOpen className="h-8 w-8 text-white/70" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="font-bold text-base leading-tight">{bookedRoom.roomName}</p>
                      {bookedRoom.pricePerNight && (
                        <p className="text-xs text-white/80">₹{bookedRoom.pricePerNight.toLocaleString()} / night</p>
                      )}
                    </div>
                    {isThisAlreadyAssigned && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Assigned
                      </div>
                    )}
                  </div>

                  {/* Quick Assign Button */}
                  {!isThisAlreadyAssigned && (
                    <Button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      onClick={() => {
                        if (bookedRoom._id) setSelectedRoomId(bookedRoom._id);
                        else {
                          setSelectedRoomId('custom');
                          setCustomRoomName(bookedRoom.roomName);
                        }
                      }}
                    >
                      Assign this Room
                    </Button>
                  )}
                </div>
              );
            })()}

            <Separator />

            {/* Room Selection Dropdown */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Or Select Different Room</p>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">Select a room...</option>
                {allRooms.map((room, index) => (
                  <option key={room._id} value={room._id}>
                    {101 + index} - {room.roomName} (₹{room.pricePerNight?.toLocaleString()} / night)
                  </option>
                ))}
                <option value="custom">-- Custom Room Name --</option>
              </select>
            </div>

            {selectedRoomId === 'custom' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Room Name</p>
                <input
                  type="text"
                  placeholder="e.g. Executive Wing 101"
                  className="w-full p-2 border rounded-md"
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRoomBooking(null)} disabled={isSavingRoom}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handleSaveRoomAssignment}
              disabled={isSavingRoom || !selectedRoomId}
            >
              {isSavingRoom ? 'Saving...' : 'Assign Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
