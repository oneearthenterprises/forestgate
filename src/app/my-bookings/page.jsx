'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, differenceInDays } from "date-fns";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Using User Context
import { useAuthContext } from "@/context/AuthContext";
import { API } from "@/lib/api/api";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from 'next/navigation';

export default function BookingHistoryPage() {
    const { user } = useAuthContext();
    const searchParams = useSearchParams();
    const queryEmail = searchParams.get('email');
    
    const headerImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
    const { toast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [cancelNote, setCancelNote] = useState('');
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserBookings = async () => {
            const emailToFetch = user?.email || queryEmail;
            if (!emailToFetch) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(API.GetUserHistory(emailToFetch));
                const data = await response.json();
                const userBookings = data.bookings || [];
                
                // Map status to Title Case if needed for backwards compatibility, 
                // but our backend stores them lowercase
                const mappedBookings = userBookings.map(b => ({
                    ...b,
                    _id: b._id,
                    status: (b.status || 'pending').charAt(0).toUpperCase() + (b.status || 'pending').slice(1)
                }));
                setBookings(mappedBookings);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserBookings();
    }, [user, queryEmail]);

    const handleReasonChange = (reason, checked) => {
        if (checked) {
            setSelectedReasons(prev => [...prev, reason]);
        } else {
            setSelectedReasons(prev => prev.filter(r => r !== reason));
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await fetch(API.CancelBooking(bookingId), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cancellationReasons: selectedReasons,
                    cancellationNote: cancelNote
                })
            });

            const data = await response.json();
            if (!response.ok) {
                 throw new Error(data.message || "Cancellation failed");
            }

            setBookings(currentBookings =>
                currentBookings.map(booking =>
                    booking._id === bookingId ? { ...booking, status: 'Cancelled' } : booking
                )
            );
            toast({
                title: "Booking Cancelled",
                description: `Your booking has been successfully cancelled.`,
            });
            setCancelNote('');
            setSelectedReasons([]);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to cancel booking. Please try again.",
            });
        }
    };

    const getBadgeVariant = (status) => {
        const lower = status.toLowerCase();
        switch (lower) {
            case 'pending':
            case 'upcoming':
                return 'default';
            case 'confirmed':
            case 'completed':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    const getPaymentBadgeClass = (status) => {
        const lower = (status || 'unpaid').toLowerCase();
        switch (lower) {
            case 'paid':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'unpaid':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'partially paid':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }

    const createInvoiceUrl = (booking) => {
        const adults = booking.guests?.adults || 0;
        const children = booking.guests?.children || 0;
        const params = new URLSearchParams();
        params.append('bookingId', booking.bookingId || booking._id);
        params.append('bookingType', booking.bookingType || booking.room?.roomName || '');
        params.append('roomName', booking.roomName || booking.bookingType || booking.room?.roomName || '');
        params.append('fullName', booking.fullName);
        params.append('email', booking.email);
        params.append('checkIn', booking.checkIn);
        params.append('checkOut', booking.checkOut);
        params.append('numAdults', adults);
        params.append('numChildren', children);
        params.append('guests', adults + children);
        params.append('totalPrice', booking.totalAmount || 0);
        
        if (booking.addons?.length > 0) {
            params.append('addons', JSON.stringify(booking.addons));
        }
        if (booking.allocation) {
            params.append('allocation', JSON.stringify(booking.allocation));
        }
        if (booking.specialRequests) {
            params.append('specialRequests', booking.specialRequests);
        }
        
        return `/booking/confirmation?${params.toString()}`;
    }

    return (
        <div>
             {headerImage && (
                <PageHeader
                title="Booking History"
                subtitle="View your past, present, and future reservations."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}
            <section>
                <div className="container mx-auto px-4 max-w-4xl">
                    {isLoading ? (
                         <div className="space-y-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border p-6 rounded-lg animate-pulse">
                                    <div className="h-8 w-3/4 bg-muted rounded-md mb-4"></div>
                                    <div className="h-6 w-full bg-muted rounded-md mb-4"></div>
                                    <div className="h-10 w-24 bg-muted rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    ) : bookings && bookings.length > 0 ? (
                        <div className="space-y-12">
                            {(() => {
                                const now = new Date();
                                const upcomingBookings = bookings.filter(b => b.status.toLowerCase() !== 'cancelled' && parseISO(b.checkOut) >= now);
                                const previousBookings = bookings.filter(b => b.status.toLowerCase() === 'cancelled' || parseISO(b.checkOut) < now);

                                const renderBookingCards = (bookingList) => (
                                    <div className="space-y-8 mt-4">
                                        {bookingList.map((booking) => {
                                            const isUpcoming = ['pending', 'upcoming', 'confirmed'].includes(booking.status.toLowerCase());
                                            const isCancellable = isUpcoming && differenceInDays(parseISO(booking.checkIn), now) > 10;

                                            return (
                                                <Card key={booking._id}>
                                                    <CardHeader>
                                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                                            <div>
                                                                <CardTitle className="font-headline text-2xl">{booking.bookingType || booking.room?.roomName}</CardTitle>
                                                                <CardDescription>Booking ID: {booking.bookingId || booking._id}</CardDescription>
                                                            </div>
                                                            <div className="flex flex-col gap-2 items-end">
                                                                <Badge 
                                                                    variant={getBadgeVariant(booking.status)}
                                                                    className="w-fit"
                                                                >
                                                                    {booking.status}
                                                                </Badge>
                                                                <Badge 
                                                                    variant="outline"
                                                                    className={`${getPaymentBadgeClass(booking.paymentStatus)} w-fit border`}
                                                                >
                                                                    {booking.paymentStatus || 'Unpaid'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-muted-foreground">Check-in</p>
                                                            <p className="font-medium">{format(parseISO(booking.checkIn), 'EEE, MMM dd, yyyy')}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-muted-foreground">Check-out</p>
                                                            <p className="font-medium">{format(parseISO(booking.checkOut), 'EEE, MMM dd, yyyy')}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-muted-foreground">Guests</p>
                                                            <p className="font-medium text-xs">
                                                                {booking.guests?.adults || 0} Adults, {booking.guests?.children || 0} Children
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-muted-foreground">Total Price</p>
                                                            <p className="font-bold text-lg">₹{(booking.totalAmount || 0).toLocaleString()}</p>
                                                        </div>
                                                    </CardContent>

                                                    {booking.status.toLowerCase() === 'cancelled' && (
                                                        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-100 rounded-lg space-y-2 text-red-900">
                                                            <div className="flex items-center gap-2 text-red-700 mb-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                                <p className="text-[10px] font-black uppercase tracking-widest">Cancellation Details</p>
                                                            </div>
                                                            {booking.cancellationReasons?.length > 0 && (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-red-700/70 uppercase mb-1">Reasons</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {booking.cancellationReasons.map((reason, i) => (
                                                                            <span key={i} className="text-[10px] bg-white text-red-700 border border-red-200 rounded-full px-2 py-0.5 font-medium">
                                                                                {reason}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {booking.cancellationNote && (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-red-700/70 uppercase mb-1">Additional Note</p>
                                                                    <p className="text-xs italic leading-relaxed">"{booking.cancellationNote}"</p>
                                                                </div>
                                                            )}
                                                            {booking.cancelledAt && (
                                                                <p className="text-[10px] text-red-600/60 pt-1">
                                                                    Cancelled on {format(parseISO(booking.cancelledAt), 'MMM dd, yyyy')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <CardFooter className="flex-wrap items-center gap-2">
                                                        {booking.paymentStatus === 'Paid' && (
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={createInvoiceUrl(booking)}>View Invoice</Link>
                                                            </Button>
                                                        )}
                                                        {isUpcoming && isCancellable && (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="destructive" size="sm">Cancel Booking</Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently cancel your booking. Please provide a reason for cancellation.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <div className="space-y-4 py-4">
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox id={`check1-${booking._id}`} onCheckedChange={(checked) => handleReasonChange("I found a better option", checked)} />
                                                                                <label htmlFor={`check1-${booking._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    I found a better option
                                                                                </label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox id={`check2-${booking._id}`} onCheckedChange={(checked) => handleReasonChange("I changed my mind", checked)} />
                                                                                <label htmlFor={`check2-${booking._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    I changed my mind
                                                                                </label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox id={`check3-${booking._id}`} onCheckedChange={(checked) => handleReasonChange("I want to reschedule my booking", checked)} />
                                                                                <label htmlFor={`check3-${booking._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    I want to reschedule my booking
                                                                                </label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox id={`check4-${booking._id}`} onCheckedChange={(checked) => handleReasonChange("Booking price is too high", checked)} />
                                                                                <label htmlFor={`check4-${booking._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    Booking price is too high
                                                                                </label>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox id={`check5-${booking._id}`} onCheckedChange={(checked) => handleReasonChange("Personal reason / plan changed", checked)} />
                                                                                <label htmlFor={`check5-${booking._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                                    Personal reason / plan changed
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2 mt-4">
                                                                            <Label htmlFor={`cancel-reason-${booking._id}`}>Additional Note</Label>
                                                                            <Textarea
                                                                                id={`cancel-reason-${booking._id}`}
                                                                                placeholder="Tell us more..."
                                                                                value={cancelNote}
                                                                                onChange={(e) => setCancelNote(e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => { setCancelNote(''); setSelectedReasons([]); }}>Back</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleCancelBooking(booking._id)}>
                                                                            Yes, Cancel Booking
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}
                                                        {isUpcoming && !isCancellable && (
                                                            <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200 bg-orange-50 font-bold px-3 py-1">
                                                                Non-Cancellable (Policy Restricted)
                                                            </Badge>
                                                        )}
                                                    </CardFooter>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                );

                                return (
                                    <>
                                        {upcomingBookings.length > 0 && (
                                            <div>
                                                <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
                                                {renderBookingCards(upcomingBookings)}
                                            </div>
                                        )}
                                        {upcomingBookings.length > 0 && previousBookings.length > 0 && <hr className="border-t border-muted my-8" />}
                                        {previousBookings.length > 0 && (
                                            <div>
                                                <h2 className="text-2xl font-bold mb-4">Previous Bookings</h2>
                                                {renderBookingCards(previousBookings)}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="text-center py-16 border rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">No Booking History</h2>
                            <p className="text-muted-foreground mb-4">You have no past bookings. Let's make some memories!</p>
                            <Button asChild>
                                <Link href="/rooms">Explore Rooms</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
