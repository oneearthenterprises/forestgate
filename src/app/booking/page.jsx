'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, differenceInDays, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Users, Check, ImageIcon, ArrowRight } from "lucide-react";
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
import Autoplay from 'embla-carousel-autoplay';

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

    const autoplay = useMemo(
        () => (typeof Autoplay === 'function' ? Autoplay({ 
          delay: 3000, 
          stopOnInteraction: false,
          stopOnMouseEnter: true
        }) : null),
        []
    );

    const plugins = useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);
    const carouselOpts = useMemo(() => ({ loop: true }), []);

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
        <div className="pt-24 pb-16 bg-background">
            <section className="pt-8">
                <div className="container mx-auto px-4">
                    {/* Premium Creative Gallery Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16 h-auto lg:h-[600px]">
                        {/* Main Large Carousel (Left - 8 columns) */}
                        <div className="lg:col-span-8 relative h-[400px] lg:h-full group">
                            <Carousel 
                                className="w-full h-full" 
                                opts={carouselOpts}
                                plugins={plugins}
                            >
                                <CarouselContent className="h-full ml-0">
                                    {itemToBook.images.map((imgId, idx) => {
                                        const img = PlaceHolderImages.find((p) => p.id === imgId);
                                        return (
                                            <CarouselItem key={imgId} className="h-full pl-0">
                                                {img && (
                                                    <div className="relative w-full h-full overflow-hidden rounded-[2rem] lg:rounded-[3rem]">
                                                        <Image
                                                            src={img.imageUrl}
                                                            alt={`${itemToBook.name} view ${idx + 1}`}
                                                            fill
                                                            priority={idx === 0}
                                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                                            data-ai-hint={img.imageHint}
                                                        />
                                                        {/* Glassmorphism navigation overlay */}
                                                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex items-center gap-4 bg-black/20 backdrop-blur-xl border border-white/10 p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                                                            <CarouselPrevious className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-black border-none transition-all shadow-none left-auto right-auto" />
                                                            <CarouselNext className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-black border-none transition-all shadow-none left-auto right-auto" />
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                                    </div>
                                                )}
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                            </Carousel>
                        </div>

                        {/* Side Images Stack (Right - 4 columns) */}
                        <div className="lg:col-span-4 grid grid-cols-3 lg:flex lg:flex-col gap-3 md:gap-4 h-auto lg:h-full">
                            {itemToBook.images.slice(1, 3).map((imgId, index) => {
                                const img = PlaceHolderImages.find((p) => p.id === imgId);
                                return (
                                    <div key={imgId} className="relative aspect-square lg:aspect-auto lg:flex-1 rounded-2xl lg:rounded-[2.5rem] overflow-hidden group">
                                        {img && (
                                            <Image
                                                src={img.imageUrl}
                                                alt={`${itemToBook.name} detail ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                data-ai-hint={img.imageHint}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                    </div>
                                );
                            })}
                            {/* The last one with "See All" trigger */}
                            <div className="relative aspect-square lg:aspect-auto lg:flex-1 rounded-2xl lg:rounded-[2.5rem] overflow-hidden group cursor-pointer">
                                {(() => {
                                    const imgId = itemToBook.images[3] || itemToBook.images[0];
                                    const img = PlaceHolderImages.find(p => p.id === imgId);
                                    return img && (
                                        <Image
                                            src={img.imageUrl}
                                            alt="See more"
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            data-ai-hint={img.imageHint}
                                        />
                                    )
                                })()}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col items-center justify-center text-white">
                                    <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 mb-1 lg:mb-2 transform group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-[10px] lg:text-sm uppercase tracking-widest text-center">See All Photos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="mb-12">
                                <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 tracking-tight">{itemToBook.name}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full font-bold text-sm">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>Up to {itemToBook.id === 'resort' ? '15' : '4'} Guests</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full font-black text-sm text-primary">
                                        ₹{itemToBook.price.toLocaleString()} / Night
                                    </div>
                                </div>
                                
                                <p className="text-foreground/70 text-xl leading-relaxed mb-12 font-light">
                                    {itemToBook.longDescription}
                                </p>

                                <Separator className="mb-12" />

                                <div className="space-y-8">
                                    <h3 className="font-headline text-3xl font-bold">What this sanctuary offers</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                        {itemToBook.amenities && itemToBook.amenities.map((amenity) => (
                                            <div key={amenity.name} className="flex items-center gap-4 group">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary transition-colors duration-300">
                                                    <Check className="w-4 h-4 text-black" />
                                                </div>
                                                <span className="text-foreground/80 font-bold text-lg">{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 pt-12">
                                    <Card ref={formRef} className="border-none shadow-none bg-muted/20 p-4 md:p-10 rounded-[3rem]">
                                        <CardHeader className="pb-10">
                                            <CardTitle className="font-headline text-4xl font-bold mb-2">Guest Information</CardTitle>
                                            <CardDescription className="text-lg">Please provide your details to secure this booking.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField
                                                    control={form.control}
                                                    name="checkIn"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Check-in Date</FormLabel>
                                                            <Popover open={isCheckInOpen} onOpenChange={setCheckInOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
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
                                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Check-out Date</FormLabel>
                                                             <Popover open={isCheckOutOpen} onOpenChange={setCheckOutOpen}>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                             <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
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
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField
                                                    control={form.control}
                                                    name="adults"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Number of Adults</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-16 rounded-2xl bg-background border-none shadow-sm font-bold">
                                                                        <Users className="h-4 w-4 text-secondary mr-2" />
                                                                        <SelectValue placeholder="Adults" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {[...Array(10)].map((_, i) => i + 1).map(g => <SelectItem key={g} value={String(g)} className="font-bold">{g} {g > 1 ? 'Adults' : 'Adult'}</SelectItem>)}
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
                                                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Number of Children</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-16 rounded-2xl bg-background border-none shadow-sm font-bold">
                                                                        <Users className="h-4 w-4 text-secondary mr-2" />
                                                                        <SelectValue placeholder="Children" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {[...Array(6)].map((_, i) => i).map(g => <SelectItem key={g} value={String(g)} className="font-bold">{g} {g === 1 ? 'Child' : 'Children'}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Full Name</FormLabel> <FormControl><Input placeholder="e.g. John Doe" {...field} className="h-16 rounded-2xl bg-background border-none shadow-sm font-bold" /></FormControl> <FormMessage /> </FormItem> )} />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Email Address</FormLabel> <FormControl><Input type="email" placeholder="you@example.com" {...field} className="h-16 rounded-2xl bg-background border-none shadow-sm font-bold" /></FormControl> <FormMessage /> </FormItem> )} />
                                                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">Phone Number</FormLabel> <FormControl><Input type="tel" placeholder="+91 9876543210" {...field} className="h-16 rounded-2xl bg-background border-none shadow-sm font-bold" /></FormControl> <FormMessage /> </FormItem> )} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                     <Button type="submit" size="lg" className="w-full h-16 rounded-full text-lg font-black uppercase tracking-widest shadow-none group transition-all" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Finalizing...' : 'Confirm My Reservation'}
                                        <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-2" />
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <aside className="lg:col-span-1">
                            <Card className="sticky top-24 border-none shadow-none overflow-hidden rounded-[3rem] bg-card">
                                <CardHeader className="bg-[#0b2c3d] text-white p-10">
                                    <CardTitle className="font-headline text-3xl font-bold mb-1">Booking Summary</CardTitle>
                                    <CardDescription className="text-white/60">Review your stay details.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-headline font-bold tracking-tight">{itemToBook.name}</h4>
                                        <div className="flex flex-col gap-3 text-sm text-muted-foreground font-bold">
                                            <div className="flex justify-between items-center py-2 border-b border-muted">
                                                <span className="uppercase tracking-widest text-[10px]">Check-in</span>
                                                <span className="text-foreground">{checkIn ? format(checkIn, 'MMM dd, yyyy') : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-muted">
                                                <span className="uppercase tracking-widest text-[10px]">Check-out</span>
                                                <span className="text-foreground">{checkOut ? format(checkOut, 'MMM dd, yyyy') : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="uppercase tracking-widest text-[10px]">Duration</span>
                                                <span className="text-foreground">{numNights} {numNights > 1 ? 'Nights' : 'Night'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground font-medium">₹{itemToBook.price.toLocaleString()} x {numNights} nights</span>
                                            <span className="font-black text-foreground">₹{(itemToBook.price * numNights).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground font-medium">Service Fee</span>
                                            <span className="text-green-600 font-black">COMPLIMENTARY</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-muted" />

                                    <div className="pt-4">
                                        <div className="flex justify-between items-end mb-6">
                                            <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Total (INR)</span>
                                            <span className="text-4xl font-black text-primary leading-none">₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-secondary/10 p-4 rounded-2xl text-center">
                                            <p className="text-[11px] text-foreground font-bold uppercase tracking-widest">
                                                * All taxes and resort fees included
                                            </p>
                                        </div>
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div></div>}>
            <BookingPageContent />
        </Suspense>
    )
}
