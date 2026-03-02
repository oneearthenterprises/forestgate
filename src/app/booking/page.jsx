'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Users, Check, ImageIcon } from "lucide-react";
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
    images: ['room-suite-1', 'amenity-pool', 'amenity-dining', 'room-cottage-1'],
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
        <div className="pt-24 pb-16">
            <section className="pt-8">
                <div className="container mx-auto px-4">
                    {/* Premium Gallery Grid Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12 h-auto lg:h-[550px]">
                        {/* Main Large Carousel (75% width on desktop) */}
                        <div className="lg:col-span-3 relative h-[350px] lg:h-full group">
                            <Carousel className="w-full h-full">
                                <CarouselContent className="h-full ml-0">
                                    {itemToBook.images.map((imgId) => {
                                        const img = PlaceHolderImages.find((p) => p.id === imgId);
                                        return (
                                            <CarouselItem key={imgId} className="h-full pl-0">
                                                {img && (
                                                    <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
                                                        <Image
                                                            src={img.imageUrl}
                                                            alt={`${itemToBook.name} image`}
                                                            fill
                                                            priority
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                            data-ai-hint={img.imageHint}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                                    </div>
                                                )}
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <CarouselPrevious className="left-6 h-12 w-12 bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CarouselNext className="right-6 h-12 w-12 bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Carousel>
                        </div>

                        {/* Side Images Stack (25% width on desktop) */}
                        <div className="hidden lg:flex flex-col gap-4 h-full">
                            {itemToBook.images.slice(1, 4).map((imgId, index) => {
                                const img = PlaceHolderImages.find((p) => p.id === imgId);
                                const isLast = index === 2;
                                return (
                                    <div key={imgId} className="relative flex-1 rounded-[1.5rem] overflow-hidden group">
                                        {img && (
                                            <Image
                                                src={img.imageUrl}
                                                alt={`${itemToBook.name} side image`}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                data-ai-hint={img.imageHint}
                                            />
                                        )}
                                        {isLast && (
                                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg text-black text-xs font-bold transition-transform active:scale-95 cursor-pointer">
                                                <ImageIcon className="w-4 h-4" />
                                                See All Photos
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Fallback if less than 4 images */}
                            {itemToBook.images.length < 4 && Array.from({ length: 4 - itemToBook.images.length }).map((_, i) => (
                                <div key={i} className="flex-1 bg-muted rounded-[1.5rem] flex items-center justify-center border border-dashed border-border/50">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight">{itemToBook.name}</h1>
                                <div className="flex items-center gap-4 text-muted-foreground mb-6">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>Up to {itemToBook.id === 'resort' ? '15' : '4'} Guests</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                    <div className="font-bold text-primary">₹{itemToBook.price.toLocaleString()} / Night</div>
                                </div>
                                
                                <p className="text-foreground/70 text-lg leading-relaxed mb-10">
                                    {itemToBook.longDescription}
                                </p>

                                <Separator className="mb-10" />

                                <div className="space-y-6">
                                    <h3 className="font-headline text-2xl font-bold">What this place offers</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                        {itemToBook.amenities && itemToBook.amenities.map((amenity) => (
                                            <div key={amenity.name} className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="text-foreground/80 font-medium">{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 pt-8">
                                    <Card ref={formRef} className="border-none shadow-none bg-muted/30 p-2 md:p-6 rounded-[2rem]">
                                        <CardHeader className="pb-8">
                                            <CardTitle className="font-headline text-3xl font-bold">Your Details</CardTitle>
                                            <CardDescription className="text-base">Please provide your information to secure this booking.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="checkIn"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Check-in</FormLabel>
                                                            <Popover open={isCheckInOpen} onOpenChange={setCheckInOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-14 rounded-2xl justify-start text-left font-normal bg-background border-border/50",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0 border-none shadow-2xl" align="start">
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
                                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Check-out</FormLabel>
                                                             <Popover open={isCheckOutOpen} onOpenChange={setCheckOutOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-14 rounded-2xl justify-start text-left font-normal bg-background border-border/50",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                             <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="p-0 border-none shadow-2xl" align="start">
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
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="adults"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Adults</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-14 rounded-2xl bg-background border-border/50">
                                                                        <Users className="h-4 w-4 text-primary mr-2" />
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
                                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Children</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-14 rounded-2xl bg-background border-border/50">
                                                                        <Users className="h-4 w-4 text-primary mr-2" />
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

                                            <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} className="h-14 rounded-2xl bg-background border-border/50" /></FormControl> <FormMessage /> </FormItem> )} />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Email</FormLabel> <FormControl><Input type="email" placeholder="john@example.com" {...field} className="h-14 rounded-2xl bg-background border-border/50" /></FormControl> <FormMessage /> </FormItem> )} />
                                                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-1">Phone</FormLabel> <FormControl><Input type="tel" placeholder="+91 9876543210" {...field} className="h-14 rounded-2xl bg-background border-border/50" /></FormControl> <FormMessage /> </FormItem> )} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                     <Button type="submit" size="lg" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Processing Payment...' : 'Secure My Stay Now'}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <aside className="lg:col-span-1">
                            <Card className="sticky top-24 border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
                                <CardHeader className="bg-primary text-primary-foreground p-8">
                                    <CardTitle className="font-headline text-3xl font-bold">Price Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold tracking-tight">{itemToBook.name}</h4>
                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>Check-in</span>
                                                <span className="font-medium text-foreground">{checkIn ? format(checkIn, 'MMM dd, yyyy') : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Check-out</span>
                                                <span className="font-medium text-foreground">{checkOut ? format(checkOut, 'MMM dd, yyyy') : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">₹{itemToBook.price.toLocaleString()} x {numNights} nights</span>
                                            <span className="font-bold">₹{(itemToBook.price * numNights).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Service Fee</span>
                                            <span className="text-green-600 font-bold">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Taxes</span>
                                            <span className="font-bold">₹0</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">Total Amount</span>
                                            <span className="text-3xl font-black text-primary">₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-4 text-center italic">
                                            * Prices are inclusive of all standard resort amenities.
                                        </p>
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
            <BookingPageContent />
        </Suspense>
    )
}
