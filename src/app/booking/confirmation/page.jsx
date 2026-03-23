'use client';

import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CheckCircle, Download, MountainSnow } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function ConfirmationPageContent() {
    const searchParams = useSearchParams();
    const invoiceRef = useRef(null);

    const bookingType = searchParams.get('bookingType');
    const fullName = searchParams.get('fullName');
    const email = searchParams.get('email');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const totalPrice = searchParams.get('totalPrice');
    const paramBookingId = searchParams.get('bookingId');
    const roomName = searchParams.get('roomName');
    const numAdults = searchParams.get('numAdults');
    const numChildren = searchParams.get('numChildren');
    const addonsRaw = searchParams.get('addons');
    const allocationRaw = searchParams.get('allocation');
    const specialRequests = searchParams.get('specialRequests');
    const internalNotes = searchParams.get('internalNotes');
    
    let addons = [];
    try {
        addons = addonsRaw ? JSON.parse(addonsRaw) : [];
    } catch (e) {
        console.error("Failed to parse addons", e);
    }

    let allocation = null;
    try {
        allocation = allocationRaw ? JSON.parse(allocationRaw) : null;
    } catch (e) {
        console.error("Failed to parse allocation", e);
    }

    // Use a stable booking ID for display
const bookingId = useRef(
  paramBookingId ||
    `FOREST-ID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
);
    const checkInDate = checkIn ? parseISO(checkIn) : new Date();
    const checkOutDate = checkOut ? parseISO(checkOut) : new Date();

    const bookingItem = bookingType || 'Your Stay';

    const handleDownloadInvoice = () => {
        const input = invoiceRef.current;
        if (!input) return;

        html2canvas(input, {
            scale: 2, // Higher scale for better quality
            useCORS: true, 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0; // Start from top

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`invoice-${bookingId.current}.pdf`);
        });
    };

    return (
        <section>
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
                <div ref={invoiceRef}>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <MountainSnow className="h-10 w-10 text-primary" />
                                    <div>
                                        <CardTitle className="font-headline text-2xl">The Forest Gate</CardTitle>
                                        <CardDescription>Invoice / Booking Confirmation</CardDescription>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">Invoice #{bookingId.current}</p>
                                    <p className="text-sm text-muted-foreground">Date: {format(new Date(), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>

                            <div className="text-center pt-4">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                                <h2 className="font-headline text-3xl md:text-4xl">Booking Confirmed!</h2>
                                <p className="text-lg text-muted-foreground mt-2">Thank you for your booking, {fullName}.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Separator />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                                 <div>
                                    <h3 className="font-semibold mb-2">Billed To</h3>
                                    <p>{fullName}</p>
                                    {email && <p className="text-muted-foreground">{email}</p>}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Reservation Details</h3>
                                    <p className="text-muted-foreground">{roomName}</p>
                                    <p className="text-muted-foreground">Adults {numAdults} </p>
                                    <p className="text-muted-foreground">Children {numChildren} </p>
                                    <p className="font-medium">Total Number of Guests: {guests}</p>
                                </div>
                            </div>
                            
                            <div className="text-left bg-muted/50 p-6 rounded-lg space-y-4">
                                <h3 className="font-bold text-xl mb-2">Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Check-in</p>
                                        <p>{format(checkInDate, 'eeee, MMM dd, yyyy')}</p>
                                    </div>
                                     <div>
                                        <p className="font-semibold">Check-out</p>
                                        <p>{format(checkOutDate, 'eeee, MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                                
                                {addons.length > 0 && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="space-y-2 text-left">
                                            <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground/70">Additional Add-ons</p>
                                            {addons.map((addon, i) => {
                                                const isCancelled = addon.status === 'cancelled';
                                                return (
                                                    <div key={i} className="flex justify-between items-center text-sm">
                                                        <p className={isCancelled ? "text-red-500/60 line-through" : "text-muted-foreground"}>
                                                            {addon.name} {isCancelled && <span className="text-[10px] font-bold ml-1">(Cancelled)</span>}
                                                        </p>
                                                        <p className={isCancelled ? "text-red-500/60 font-medium line-through" : "font-medium"}>
                                                            ₹{(addon.price || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {allocation && (
                                     <>
                                        <Separator className="my-2" />
                                        <div className="space-y-2 text-left">
                                            <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground/70">Guest Allotment</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                {Object.entries(allocation).filter(([_, details]) => details.count > 0).map(([room, details], i) => (
                                                    <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-1">
                                                        <p className="text-muted-foreground font-medium">{room}</p>
                                                        <p className="text-primary font-bold">{details.count} Guests</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                     </>
                                )}

                                {(specialRequests || internalNotes) && (
                                    <>
                                        <Separator className="my-2" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                            {specialRequests && (
                                                <div className="space-y-1">
                                                     <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground/70">Special Requests</p>
                                                     <p className="text-xs italic bg-orange-50/50 p-2 rounded border border-orange-100/50">"{specialRequests}"</p>
                                                </div>
                                            )}
                                            {internalNotes && (
                                                <div className="space-y-1">
                                                     <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground/70">Admin Notes</p>
                                                     <p className="text-xs italic bg-blue-50/50 p-2 rounded border border-blue-100/50">"{internalNotes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                
                                <Separator/>
                                 <div className="flex justify-between items-center pt-2">
                                    <p className="font-semibold text-lg">Total Amount</p>
                                    <p className="font-bold text-xl">₹{Number(totalPrice).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="pt-6 text-center text-sm text-muted-foreground">
                                <p>We look forward to welcoming you to The Forest Gate.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                    <Button variant="secondary" onClick={handleDownloadInvoice}>
                        <Download className="mr-2 h-4 w-4"/>
                        Download Invoice
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading confirmation...</div>}>
            <ConfirmationPageContent />
        </Suspense>
    )
}
