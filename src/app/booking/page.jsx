'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Users, Check } from "lucide-react";
import Calendar from 'react-calendar';
import Image from 'next/image';

import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import { rooms } from '../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const BookingFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Invalid phone number."),
  checkIn: z.date({ required_error: "Check-in date is required." }),
  checkOut: z.date({ required_error: "Check-out date is required." }),
  adults: z.string().min(1, "At least one adult is required."),
  children: z.string(),
}).refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
});


const RESORT_PRICE_PER_NIGHT = 57000;
const RESORT_DETAILS = {
    id: 'resort',
    name: 'Entire Resort',
    longDescription: 'For ultimate privacy and a truly bespoke experience, book the entire The Forest Gate. You\'ll get exclusive access to all our accommodations and world-class amenities. Perfect for large families, special events, or corporate retreats.',
    price: RESORT_PRICE_PER_NIGHT,
    images: ['room-suite-1', 'amenity-pool', 'amenity-dining'],
    amenities: [
        { name: 'All Rooms & Suites' },
        { name: 'Private Pool' },
        { name: 'Private Cinema' },
        { name: 'All Dining Areas' },
        { name: 'Full Staff Service' },
        { name: 'All Activities' },
    ],
};

function BookingPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [isCheckInOpen, setCheckInOpen] = useState(false);
    const [isCheckOutOpen, setCheckOutOpen] = useState(false);
    const formRef = useRef(null);

    const roomId = searchParams.get('roomId');
    const roomToBook = rooms.find(r => r.id === roomId);
    const itemToBook = roomToBook || RESORT_DETAILS;

    const searchCheckIn = searchParams.get('checkIn');
    const searchCheckOut = searchParams.get('checkOut');
    const searchGuests = searchParams.get('guests');

    const defaultCheckIn = searchCheckIn ? parseISO(searchCheckIn) : new Date();
    const defaultCheckOut = searchCheckOut ? parseISO(searchCheckOut) : addDays(defaultCheckIn, 1);
    const defaultAdults = searchGuests || '2';

    const form = useForm({
        resolver: zodResolver(BookingFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            checkIn: defaultCheckIn,
            checkOut: defaultCheckOut,
            adults: defaultAdults,
            children: '0',
        },
    });

    useEffect(() => {
        // Scroll the form into view when the component mounts
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, []);

    const { checkIn, checkOut, adults, children } = form.watch();

    const numNights = checkIn && checkOut && differenceInDays(checkOut, checkIn) > 0 ? differenceInDays(checkOut, checkIn) : 1;
    const totalPrice = itemToBook.price * numNights;
    
    const numAdults = adults ? parseInt(adults) : 0;
    const numChildren = children ? parseInt(children) : 0;


    async function onSubmit(data) {
        const bookingData = {
          bookingType: itemToBook.name,
          ...data,
          totalPrice,
          guests: numAdults + numChildren,
          checkIn: format(data.checkIn, 'yyyy-MM-dd'),
          checkOut: format(data.checkOut, 'yyyy-MM-dd'),
        };

        const params = new URLSearchParams();
        params.append('bookingType', bookingData.bookingType);
        params.append('fullName', bookingData.fullName);
        params.append('email', bookingData.email);
        params.append('checkIn', bookingData.checkIn);
        params.append('checkOut', bookingData.checkOut);
        params.append('guests', bookingData.guests.toString());
        params.append('totalPrice', bookingData.totalPrice.toString());

        toast({
            title: "Processing Payment...",
            description: "Please wait while we confirm your booking.",
        });

        // Simulate payment processing
        setTimeout(() => {
            toast({
                title: "Booking Confirmed!",
                description: `We've sent a confirmation to ${bookingData.email}.`,
            });
            router.push(`/booking/confirmation?${params.toString()}`);
        }, 2000);
    }

    return (
        <div className="pt-24">
            <section>
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle className="font-headline text-3xl">{itemToBook.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Carousel className="w-full mb-6">
                                        <CarouselContent>
                                            {itemToBook.images.map((imgId) => {
                                            const img = PlaceHolderImages.find(
                                                (p) => p.id === imgId
                                            );
                                            return (
                                                <CarouselItem key={imgId}>
                                                {img && (
                                                    <Image
                                                    src={img.imageUrl}
                                                    alt={`${itemToBook.name} image`}
                                                    width={800}
                                                    height={600}
                                                    className="rounded-lg shadow-lg object-cover w-full aspect-[4/3]"
                                                    data-ai-hint={img.imageHint}
                                                    placeholder="blur"
                                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                                    />
                                                )}
                                                </CarouselItem>
                                            );
                                            })}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-4" />
                                        <CarouselNext className="right-4" />
                                    </Carousel>
                                    <p className="text-foreground/80 mb-6">
                                        {itemToBook.longDescription}
                                    </p>
                                    {itemToBook.amenities && itemToBook.amenities.length > 0 && (
                                        <>
                                            <h4 className="font-bold text-lg mb-3">
                                              Amenities:
                                            </h4>
                                            <ul className="grid grid-cols-2 gap-2 mb-6">
                                              {itemToBook.amenities.map((amenity) => (
                                                <li
                                                  key={amenity.name}
                                                  className="flex items-center gap-2"
                                                >
                                                  <Check className="w-4 h-4 text-primary" />
                                                  <span>{amenity.name}</span>
                                                </li>
                                              ))}
                                            </ul>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                                    <Card ref={formRef}>
                                        <CardHeader>
                                            <CardTitle className="font-headline text-2xl">Your Information</CardTitle>
                                            <CardDescription>Confirm your dates and enter your information to complete the booking.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="checkIn"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Check-in</FormLabel>
                                                            <Popover open={isCheckInOpen} onOpenChange={setCheckInOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full justify-start text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0">
                                                                    <Calendar
                                                                        onChange={(date) => {
                                                                            field.onChange(date);
                                                                            setCheckInOpen(false);
                                                                        }}
                                                                        value={field.value}
                                                                        minDate={new Date()}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="checkOut"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Check-out</FormLabel>
                                                             <Popover open={isCheckOutOpen} onOpenChange={setCheckOutOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full justify-start text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                             <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0">
                                                                    <Calendar
                                                                        onChange={(date) => {
                                                                            field.onChange(date);
                                                                            setCheckOutOpen(false);
                                                                        }}
                                                                        value={field.value}
                                                                        minDate={addDays(form.getValues("checkIn") || new Date(), 1)}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="adults"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Adults</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <Users className="h-4 w-4 opacity-50 mr-2" />
                                                                        <SelectValue placeholder="Adults" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {[...Array(10)].map((_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)}>{g} {g > 1 ? 'Adults' : 'Adult'}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="children"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Children</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <Users className="h-4 w-4 opacity-50 mr-2" />
                                                                        <SelectValue placeholder="Children" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {[...Array(6)].map((_, i) => i).map(g => <SelectItem key={g} value={String(g)}>{g} {g === 1 ? 'Child' : 'Children'}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                            <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone</FormLabel> <FormControl><Input type="tel" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                        </CardContent>
                                    </Card>

                                     <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Confirming...' : 'Confirm & Pay'}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <aside className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Booking Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2 border-b pb-4">
                                        <h4 className="text-lg font-semibold">{itemToBook.name}</h4>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Check-in</span>
                                            <span>{checkIn ? format(checkIn, 'MMM dd, yyyy') : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Check-out</span>
                                            <span>{checkOut ? format(checkOut, 'MMM dd, yyyy') : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 border-b pb-4">
                                        <div className="flex justify-between font-medium">
                                            <span>Guests</span>
                                            <span>{numAdults + numChildren}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Adults</span>
                                            <span>{numAdults}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Children</span>
                                            <span>{numChildren}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span>{itemToBook.price.toLocaleString()} x {numNights} {numNights > 1 ? 'nights' : 'night'}</span>
                                            <span>₹{(itemToBook.price * numNights).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Taxes & Fees</span>
                                            <span>₹0</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="text-xl font-bold flex justify-between items-center mt-4">
                                        <span>Total</span>
                                        <span>₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingPageContent />
        </Suspense>
    )
}
