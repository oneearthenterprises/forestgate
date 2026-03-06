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

const today = new Date();
const initialBookings = [
    {
        id: 'HH-CANCELLABLE',
        bookingType: 'Deluxe Room',
        checkIn: new Date(new Date().setDate(today.getDate() + 15)).toISOString().split('T')[0],
        checkOut: new Date(new Date().setDate(today.getDate() + 20)).toISOString().split('T')[0],
        guests: 2,
        totalPrice: 75000,
        status: 'Upcoming',
        fullName: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
    },
    {
        id: 'HH-NON-CANCELLABLE',
        bookingType: 'Entire Resort',
        checkIn: new Date(new Date().setDate(today.getDate() + 5)).toISOString().split('T')[0],
        checkOut: new Date(new Date().setDate(today.getDate() + 9)).toISOString().split('T')[0],
        guests: 15,
        totalPrice: 228000,
        status: 'Upcoming',
        fullName: 'Priya Desai',
        email: 'priya.desai@example.com',
    },
    {
        id: 'HH-3G8H9I',
        bookingType: 'Family Room',
        checkIn: '2024-05-20',
        checkOut: '2024-05-25',
        guests: 4,
        totalPrice: 100000,
        status: 'Completed',
        fullName: 'The Sharma Family',
        email: 'sharma.family@example.com',
    },
    {
        id: 'HH-K2L3M4',
        bookingType: 'Single Room',
        checkIn: '2024-04-15',
        checkOut: '2024-04-18',
        guests: 1,
        totalPrice: 30000,
        status: 'Cancelled',
        fullName: 'Anjali Verma',
        email: 'anjali.verma@example.com',
    },
];


export default function BookingHistoryPage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
    const { toast } = useToast();
    const [bookings, setBookings] = useState(initialBookings);
    const [cancelReason, setCancelReason] = useState('');
    const isLoading = false;

    const handleCancelBooking = (bookingId) => {
        setBookings(currentBookings =>
            currentBookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking
            )
        );
        toast({
            title: "Booking Cancelled",
            description: `Your booking ${bookingId} has been successfully cancelled.`,
        });
        setCancelReason('');
    };

    const getBadgeVariant = (status) => {
        switch (status) {
            case 'Upcoming':
                return 'default';
            case 'Completed':
                return 'secondary';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    const createInvoiceUrl = (booking) => {
        const params = new URLSearchParams();
        params.append('bookingId', booking.id);
        params.append('bookingType', booking.bookingType);
        params.append('fullName', booking.fullName);
        params.append('email', booking.email);
        params.append('checkIn', booking.checkIn);
        params.append('checkOut', booking.checkOut);
        params.append('guests', booking.guests);
        params.append('totalPrice', booking.totalPrice);
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
                        <div className="space-y-8">
                            {bookings.map((booking) => {
                                const isCancellable = booking.status === 'Upcoming' && differenceInDays(parseISO(booking.checkIn), new Date()) > 10;

                                return (
                                <Card key={booking.id}>
                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                            <div>
                                                <CardTitle className="font-headline text-2xl">{booking.bookingType}</CardTitle>
                                                <CardDescription>Booking ID: {booking.id}</CardDescription>
                                            </div>
                                            <Badge 
                                                variant={getBadgeVariant(booking.status)}
                                                className="w-fit"
                                            >
                                                {booking.status}
                                            </Badge>
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
                                            <p className="font-medium">{booking.guests}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-muted-foreground">Total Price</p>
                                            <p className="font-bold text-lg">₹{booking.totalPrice.toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-wrap items-center gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={createInvoiceUrl(booking)}>View Invoice</Link>
                                        </Button>
                                        {booking.status === 'Upcoming' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" disabled={!isCancellable}>Cancel Booking</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently cancel your booking. Please provide a reason for cancellation.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`cancel-reason-${booking.id}`}>Reason for Cancellation</Label>
                                                        <Textarea
                                                            id={`cancel-reason-${booking.id}`}
                                                            placeholder="Tell us why you're cancelling..."
                                                            value={cancelReason}
                                                            onChange={(e) => setCancelReason(e.target.value)}
                                                        />
                                                    </div>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setCancelReason('')}>Back</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                                                            Yes, Cancel Booking
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        {!isCancellable && booking.status === 'Upcoming' && (
                                            <p className="text-xs text-muted-foreground ml-2">
                                                Cancellation is only available up to 10 days before check-in.
                                            </p>
                                        )}
                                    </CardFooter>
                                </Card>
                            )})}
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
