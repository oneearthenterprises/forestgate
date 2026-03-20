"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, differenceInDays, addDays, isWithinInterval, areIntervalsOverlapping, startOfDay, endOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { allocateRooms } from "@/lib/utils/allocation";
import {
  CalendarIcon,
  Users,
  Check,
  ImageIcon,
  Plus,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";
import Calendar from "react-calendar";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { rooms } from "../lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { API } from "@/lib/api/api";
import { useAuthContext } from "@/context/AuthContext";

const BookingFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(10, "Invalid phone number."),
    checkIn: z.date({ required_error: "Check-in date is required." }),
    checkOut: z.date({ required_error: "Check-out date is required." }),
    adults: z.string().min(1, "At least one adult is required."),
    children: z.string(),
    guestDetails: z.array(z.object({
      name: z.string().min(2, "Name is required."),
      gender: z.string().min(1, "Gender is required."),
      age: z.string().min(1, "Age is required."),
      type: z.enum(["Adult", "Child"]),
    })).optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
  });






function BookingPageContent() {
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const router = useRouter();
  const { toast } = useToast();

  const [room, setRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedAdditionalRooms, setSelectedAdditionalRooms] = useState([]);
  const [isCheckInOpen, setCheckInOpen] = useState(false);
  const [isCheckOutOpen, setCheckOutOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        if (roomId) {
          const response = await fetch(API.getRoomById(roomId));
          const data = await response.json();
          if (data?.room) setRoom(data.room);
        } else {
          const response = await fetch(API.GetAllRooms);
          const data = await response.json();
          if (data?.rooms?.length > 0) setRoom(data.rooms[0]);
        }
        
        // Fetch all rooms for recommendations
        const allRoomsRes = await fetch(API.GetAllRooms);
        const allRoomsData = await allRoomsRes.json();
        if (allRoomsData?.rooms) {
          const otherRooms = allRoomsData.rooms
            .filter(r => (r._id || r.id) !== roomId)
            .sort((a, b) => a.pricePerNight - b.pricePerNight);
          setAllRooms(otherRooms);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    getRoomData();
  }, [roomId]);

  const autoplay = useMemo(
    () =>
      typeof Autoplay === "function"
        ? Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          })
        : null,
    [],
  );
  const plugins = useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);
  const carouselOpts = useMemo(() => ({ loop: true }), []);

  const form = useForm({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      checkIn: searchParams.get("checkIn") ? parseISO(searchParams.get("checkIn")) : new Date(),
      checkOut: searchParams.get("checkOut") ? parseISO(searchParams.get("checkOut")) : addDays(new Date(), 1),
      adults: searchParams.get("guests") || "2",
      children: "0",
      guestDetails: [],
    },
  });

  const { checkIn, checkOut, adults, children, guestDetails: guestDetailsWatch } = form.watch();

  const numNights =
    checkIn && checkOut && differenceInDays(checkOut, checkIn) > 0
      ? differenceInDays(checkOut, checkIn)
      : 1;

  const numAdults = adults ? parseInt(adults) : 0;
  const numChildren = children ? parseInt(children) : 0;

  const isSelectedRangeValid = useMemo(() => {
    if (!checkIn || !checkOut || !bookedDates.length) return true;
    try {
      return !bookedDates.some(interval => 
        areIntervalsOverlapping(
          { start: startOfDay(checkIn), end: endOfDay(checkOut) },
          interval
        )
      );
    } catch (e) {
      return true;
    }
  }, [checkIn, checkOut, bookedDates]);

  // Restore data from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem("tempBookingData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        ...parsed,
        checkIn: new Date(parsed.checkIn),
        checkOut: new Date(parsed.checkOut),
      });
      sessionStorage.removeItem("tempBookingData");
      toast({
        title: "Details Restored",
        description: "We've restored your booking details.",
      });
    }

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  // 🔹 Synchronize guestDetails array with adults/children count
  useEffect(() => {
    const currentDetails = form.getValues("guestDetails") || [];
    const totalCount = numAdults + numChildren;
    
    if (totalCount !== currentDetails.length) {
      const newDetails = [];
      // Add adults
      for (let i = 0; i < numAdults; i++) {
        newDetails.push(currentDetails[i] || { name: "", gender: "Male", age: "25", type: "Adult" });
      }
      // Add children
      for (let i = 0; i < numChildren; i++) {
        const childIdx = numAdults + i;
        newDetails.push(currentDetails[childIdx] || { name: "", gender: "Male", age: "5", type: "Child" });
      }
      form.setValue("guestDetails", newDetails);
    }
  }, [numAdults, numChildren, form]);

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (user && !sessionStorage.getItem("tempBookingData")) {
      form.setValue("fullName", user.name || "");
      form.setValue("email", user.email || "");
      form.setValue("phone", user.phone?.toString() || "");
    }
  }, [user, form]);


  // 🔹 New Dynamic Allocation Logic (Hybrid: Manual + Auto)
  const allocation = useMemo(() => {
    if (!room || numAdults < 1) return { allocatedRooms: [], totalRooms: 0, totalPrice: 0 };
    
    // Start with the primary room
    let rooms = [];
    let remainingAdults = numAdults;
    let remainingChildren = numChildren;
    
    const basePrice = room.pricePerNight || 0;
    const beddingCharge = 1500;

    // 1. Assign Primary Room
    let primaryRoom = { adults: 0, children: 0, extraBedding: false, name: room.roomName, price: basePrice };
    if (remainingAdults >= 3 && selectedAdditionalRooms.length === 0 && remainingAdults === numAdults) {
       // Only if no manual rooms and we have 3 adults, use the primary as the 3-adult room
       primaryRoom.adults = 3;
       primaryRoom.extraBedding = true;
       remainingAdults -= 3;
    } else {
       primaryRoom.adults = Math.min(2, remainingAdults);
       remainingAdults -= primaryRoom.adults;
       primaryRoom.children = Math.min(2, remainingChildren);
       remainingChildren -= primaryRoom.children;
    }
    rooms.push(primaryRoom);

    // 2. Assign Manual Selections (Selected Additional Rooms)
    selectedAdditionalRooms.forEach((addonRoom) => {
      if (remainingAdults > 0 || remainingChildren > 0) {
        let r = { adults: 0, children: 0, extraBedding: false, name: addonRoom.roomName, price: addonRoom.pricePerNight * 0.9 };
        if (remainingAdults >= 3) {
          r.adults = 3;
          r.extraBedding = true;
          r.price += beddingCharge;
          remainingAdults -= 3;
        } else {
          r.adults = Math.min(2, remainingAdults);
          remainingAdults -= r.adults;
          r.children = Math.min(2, remainingChildren);
          remainingChildren -= r.children;
        }
        rooms.push(r);
      }
    });

    // 3. Auto-allocate remaining guests using primary room type
    if (remainingAdults > 0 || remainingChildren > 0) {
      const remainingResult = allocateRooms(remainingAdults, remainingChildren, basePrice, beddingCharge);
      // Apply discount since these are additional rooms
      const adjustedRemaining = remainingResult.allocatedRooms.map(r => ({
        ...r,
        name: room.roomName,
        price: (r.price - (r.extraBedding ? beddingCharge : 0)) * 0.9 + (r.extraBedding ? beddingCharge : 0)
      }));
      rooms.push(...adjustedRemaining);
    }

    const totalAllocationPrice = rooms.reduce((sum, r) => sum + r.price, 0);

    return {
      allocatedRooms: rooms,
      totalRooms: rooms.length,
      totalPrice: totalAllocationPrice,
    };
  }, [numAdults, numChildren, room, selectedAdditionalRooms]);

  const totalPrice = allocation.totalPrice * numNights;
  const totalRoomsNeeded = allocation.totalRooms;

  const autoAddons = useMemo(() => {
    const addons = [];
    if (allocation.allocatedRooms.some(r => r.extraBedding)) {
      addons.push("Extra Bedding Required");
    }
    return addons;
  }, [allocation]);

  // 🔹 Capacity Check for manual recommendations
  const currentRoomMaxCapacity = 4; // 2 Adult + 2 Child (Based on user rules)
  const isCapacityExceeded = (numAdults + numChildren) > currentRoomMaxCapacity || numAdults > 2;

  async function onSubmit(data) {
    if (!user) {
      sessionStorage.setItem("tempBookingData", JSON.stringify({
        ...data,
        checkIn: data.checkIn.toISOString(),
        checkOut: data.checkOut.toISOString(),
      }));
      
      const callbackUrl = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      toast({
        title: "Login Required",
        description: "Please login to complete your reservation. Your details have been saved.",
      });
      return;
    }

    const bookingData = {
      roomId: room._id || room.id,
      bookingType: room.roomName || room.fullName,
      roomName: room.roomName,
      ...data,
      totalPrice,
      guests: numAdults + numChildren,
      numAdults,
      numChildren,
      allocation: allocation.allocatedRooms,
      totalRooms: totalRoomsNeeded,
      checkIn: format(data.checkIn, "yyyy-MM-dd"),
      checkOut: format(data.checkOut, "yyyy-MM-dd"),
    };

    toast({
      title: "Processing Booking...",
      description: "Please wait while we confirm your reservation.",
    });

    try {
      const response = await fetch(API.CreateBooking, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const responseData = await response.json();

      const params = new URLSearchParams();
      params.append("bookingType", bookingData.bookingType);
      params.append("fullName", bookingData.fullName);
      params.append("email", bookingData.email);
      params.append("checkIn", bookingData.checkIn);
      params.append("checkOut", bookingData.checkOut);
      params.append("guests", bookingData.guests.toString());
      params.append("totalPrice", bookingData.totalPrice.toString());
      params.append("roomName", bookingData.roomName);
      params.append("numAdults", bookingData.numAdults);
      params.append("numChildren", bookingData.numChildren);
      params.append("bookingId", responseData.booking?.bookingId || responseData.booking?._id || "");
      
      const twilioStatus = responseData.booking?.notificationStatus === 'skipped' 
        ? " (Admin Notified - Demo)" 
        : responseData.booking?.notificationStatus === 'sent' || responseData.booking?.twilioMessageSid
          ? " (Admin Notified via WhatsApp)" 
          : " (Notification Pending)";

      toast({
        title: "Booking Request Sent!",
        description: `Your reservation has been received${twilioStatus}. You will receive an update once it is confirmed.`,
      });
      
      router.push(`/my-bookings?email=${encodeURIComponent(bookingData.email)}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Something went wrong while processing your booking. Please try again.",
      });
    }
  }

  // 🔹 Fetch Booked Dates for the selected room
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!room?._id && !room?.id) return;
      
      setIsCheckingAvailability(true);
      try {
        const id = room._id || room.id;
        const response = await fetch(API.GetRoomAvailability(id));
        const data = await response.json();
        
        if (data?.bookings) {
          // Flatten bookings into a list of intervals
          const intervals = data.bookings.map(b => ({
            start: startOfDay(parseISO(b.checkIn)),
            end: endOfDay(parseISO(b.checkOut))
          }));
          setBookedDates(intervals);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    fetchAvailability();
  }, [room]);

  // 🔹 Helper to check if a single date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(interval => 
      isWithinInterval(startOfDay(date), interval)
    );
  };

  // 🔹 Helper to check if a range is available

if (!room) return <BookingSkeleton />;

  return (
    <div className="pt-24 pb-16 bg-[#fcfcfc]">
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
                 {room?.images?.map((img, idx) => {
                
                    return (
                      <CarouselItem key={idx} className="h-full pl-0">
                      
                          <div className="relative w-full h-full overflow-hidden rounded-[2rem] lg:rounded-[3rem]">
                             <Image
                                                        src={img.url}
                                                        alt={`${room.roomName} ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        priority={idx === 0}
                                                      />
                            {/* Glassmorphism navigation overlay */}
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex items-center gap-4 bg-black/20 backdrop-blur-xl border border-white/10 p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                              <CarouselPrevious className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-black border-none transition-all shadow-none left-auto right-auto" />
                              <CarouselNext className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-black border-none transition-all shadow-none left-auto right-auto" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          </div>
                       
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="lg:col-span-4 grid grid-cols-3 lg:flex lg:flex-col gap-3 md:gap-4 h-auto lg:h-full">
              {room?.images?.slice(1, 3).map((img, idx) => {
             
                return (
                  <div
                    key={img.id}
                    className="relative aspect-square lg:aspect-auto lg:flex-1 rounded-2xl lg:rounded-[2.5rem] overflow-hidden group"
                  >
                    {img && (
                      <Image
                        src={img.url}
                       alt={`${room.roomName} ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                );
              })}
              <div className="relative aspect-square lg:aspect-auto lg:flex-1 rounded-2xl lg:rounded-[2.5rem] overflow-hidden group cursor-pointer">
                {(() => {
                 const img = room?.images?.[3];
                  return (
                    img && (
                      <Image
                        src={img.url}
                        alt="See more"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )
                  );
                })()}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex flex-col items-center justify-center text-white">
                  <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 mb-1 lg:mb-2 transform group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[10px] lg:text-sm uppercase tracking-widest text-center">
                    See All Photos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h1 className="font-headline text-5xl md:text-6xl font-bold mb-6 tracking-tight">
               {room?.roomName}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full font-bold text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    {/* <span>
                      Up to {room?.id === "resort" ? "15" : "4"} Guests
                    </span> */}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full font-black text-sm text-primary">
                    ₹{room?.pricePerNight.toLocaleString()} / Night
                  </div>
                </div>

                <p className="text-foreground/70 text-xl leading-relaxed mb-12 font-light">
                  {room?.fullDescription}
                </p>

                <Separator className="mb-12" />

                <div className="space-y-8">
                  <h3 className="font-headline text-3xl font-bold">
                    What this sanctuary offers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                    {room?.amenities &&
                      room?.amenities.map((amenity,index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary transition-colors duration-300">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                          <span className="text-foreground/80 font-bold text-lg">
                          {amenity}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-12 pt-12"
                >
                  <Card
                    ref={formRef}
                    className="border-none shadow-none bg-primary/20 rounded-[3rem]"
                  >
                    <CardHeader className="pb-10">
                      <CardTitle className="font-headline text-4xl font-bold mb-2">
                        Booking Contact Details
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Please provide contact details for this reservation. Note: This will not change your main account profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Check-in Date
                              </FormLabel>
                              <Popover
                                open={isCheckInOpen}
                                onOpenChange={setCheckInOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="p-0 border-none shadow-2xl"
                                  align="start"
                                >
                                  <Calendar
                                    onChange={(date) => {
                                      field.onChange(date);
                                      setCheckInOpen(false);
                                    }}
                                    value={field.value}
                                    minDate={new Date()}
                                    tileDisabled={({ date }) => isDateBooked(date)}
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
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Check-out Date
                              </FormLabel>
                              <Popover
                                open={isCheckOutOpen}
                                onOpenChange={setCheckOutOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="p-0 border-none shadow-2xl"
                                  align="start"
                                >
                                  <Calendar
                                    onChange={(date) => {
                                      field.onChange(date);
                                      setCheckOutOpen(false);
                                    }}
                                    value={field.value}
                                    minDate={addDays(
                                      form.getValues("checkIn") || new Date(),
                                      1,
                                    )}
                                    tileDisabled={({ date }) => isDateBooked(date)}
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
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Number of Adults
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-16 rounded-2xl bg-background border-none shadow-sm text-gray">
                                    <Users className="h-4 w-4 text-secondary mr-2" />
                                    <SelectValue placeholder="Adults" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(10)]
                                    .map((_, i) => i + 1)
                                    .map((g) => (
                                      <SelectItem
                                        key={g}
                                        value={String(g)}
                                        className=""
                                      >
                                        {g} {g > 1 ? "Adults" : "Adult"}
                                      </SelectItem>
                                    ))}
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
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Number of Children
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-16 rounded-2xl bg-background border-none shadow-sm ">
                                    <Users className="h-4 w-4 text-secondary mr-2" />
                                    <SelectValue placeholder="Children" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[...Array(11)]
                                    .map((_, i) => i)
                                    .map((g) => (
                                      <SelectItem
                                        key={g}
                                        value={String(g)}
                                        className=""
                                      >
                                        {g} {g === 1 ? "Child" : "Children"}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* 🔹 Room Capacity Suggestions (New) */}
                      {isCapacityExceeded && allRooms.length > 0 && (
                        <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <ArrowRightCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-headline text-xl font-bold">Sanctuary Capacity Suggestions</h4>
                              <p className="text-sm text-muted-foreground font-medium">Your selection exceeds one room's capacity. We've found the best deals for your additional guests:</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allRooms.slice(0, 2).map((r, i) => (
                              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-2xl relative overflow-hidden bg-slate-100 flex-shrink-0">
                                    {r.images?.[0] && <Image src={r.images[0].url} fill className="object-cover" alt={r.roomName} />}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{r.roomName}</p>
                                    <p className="text-primary font-black text-xs">₹{r.pricePerNight.toLocaleString()}/night</p>
                                  </div>
                                </div>
                                <Button 
                                  type="button" 
                                  variant={selectedAdditionalRooms.some(sr => sr._id === r._id) ? "default" : "ghost"} 
                                  className={`rounded-full w-10 h-10 p-0 ${selectedAdditionalRooms.some(sr => sr._id === r._id) ? "bg-primary text-white" : "hover:bg-primary/10 text-primary"}`}
                                  onClick={() => {
                                    if (selectedAdditionalRooms.some(sr => sr._id === r._id)) {
                                      setSelectedAdditionalRooms(prev => prev.filter(sr => sr._id !== r._id));
                                    } else {
                                      setSelectedAdditionalRooms(prev => [...prev, r]);
                                      toast({
                                        title: "Room Added",
                                        description: `${r.roomName} has been added to your sanctuary allocation.`,
                                      });
                                    }
                                  }}
                                >
                                  {selectedAdditionalRooms.some(sr => sr._id === r._id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </Button>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center font-bold">
                            * Auto-allocation ensures the best price and 10% multi-room discount
                          </p>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            {" "}
                            <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                              Booking Full Name
                            </FormLabel>{" "}
                            <FormControl>
                              <Input
                                placeholder="e.g. John Doe"
                                {...field}
                                className="h-16 rounded-2xl bg-background border-none shadow-sm"
                              />
                            </FormControl>{" "}
                            <FormMessage />{" "}
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              {" "}
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Booking Email Address
                              </FormLabel>{" "}
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  {...field}
                                  readOnly={!!user}
                                  className={cn(
                                    "h-16 rounded-2xl bg-background border-none shadow-sm",
                                    user && "opacity-70 cursor-not-allowed"
                                  )}
                                />
                              </FormControl>{" "}
                              <FormMessage />{" "}
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              {" "}
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Mobile Number 
                                (WhatsApp)
                              </FormLabel>{" "}
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+91 9876543210"
                                  {...field}
                                  className="h-16 rounded-2xl bg-background border-none shadow-sm "
                                />
                              </FormControl>{" "}
                              <FormMessage />{" "}
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* 🔹 Guest Profiles Section */}
                      <div className="pt-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-secondary" />
                            Guest Profiles
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground bg-white/50 p-4 rounded-xl border border-white/20 font-medium">
                          Please provide details for each guest. This helps us prepare the right bedding and amenities for your sanctuary stay.
                        </p>
                        
                        <div className="space-y-4">
                          {guestDetailsWatch.map((guest, idx) => (
                            <div key={idx} className="bg-white/40 p-6 rounded-[2rem] border border-white/30 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0b2c3d]">
                                  Guest {idx + 1} ({guest.type})
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`guestDetails.${idx}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Full Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Guest name" className="bg-white border-none rounded-xl h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`guestDetails.${idx}.gender`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Gender</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-none rounded-xl h-12">
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Male">Male</SelectItem>
                                          <SelectItem value="Female">Female</SelectItem>
                                          <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`guestDetails.${idx}.age`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Age</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} className="bg-white border-none rounded-xl h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        "w-full h-16 rounded-full text-lg font-black uppercase tracking-widest shadow-none group transition-all",
                        !isSelectedRangeValid && "bg-destructive hover:bg-destructive/90"
                      )}
                      disabled={form.formState.isSubmitting || !isSelectedRangeValid || isCheckingAvailability}
                    >
                      {isCheckingAvailability 
                        ? "Checking Availability..." 
                        : form.formState.isSubmitting
                          ? "Finalizing..."
                          : !isSelectedRangeValid
                            ? "Room Not Available on these dates"
                            : "Confirm My Reservation On Whatsapp"}
                      <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </Button>
                </form>
              </Form>
            </div>

            <aside className="lg:col-span-1">
              <Card className="sticky top-24 border-none shadow-none overflow-hidden rounded-[3rem] bg-card">
                <CardHeader className="bg-[#0b2c3d] text-white p-10">
                  <CardTitle className="font-headline text-3xl font-bold mb-1">
                    Booking Summary
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Review your stay details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-headline font-bold tracking-tight">
                      {room?.roomName}
                    </h4>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-bold">
                    {totalRoomsNeeded > 1 && (
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="uppercase tracking-widest text-[10px]">
                          Allocation
                        </span>
                        <span className="text-foreground font-black">
                          {totalRoomsNeeded} Rooms
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="uppercase tracking-widest text-[10px]">
                          Check-in
                        </span>
                        <span className="text-foreground">
                          {checkIn ? format(checkIn, "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="uppercase tracking-widest text-[10px]">
                          Check-out
                        </span>
                        <span className="text-foreground">
                          {checkOut ? format(checkOut, "MMM dd, yyyy") : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="uppercase tracking-widest text-[10px]">
                          Duration
                        </span>
                        <span className="text-foreground">
                          {numNights} {numNights > 1 ? "Nights" : "Night"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        Room Allocation Price
                      </span>
                      <span className="font-black text-foreground">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    {totalRoomsNeeded > 1 && (
                      <div className="flex flex-col gap-1 pt-2">
                        {allocation.allocatedRooms.map((r, i) => (
                          <div key={i} className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Room {i+1}: {r.name} ({r.adults}A, {r.children}C{r.extraBedding ? " + Bed" : ""})</span>
                            <span>₹{r.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        Service Fee
                      </span>
                      <span className="text-green-600 font-black">
                        COMPLIMENTARY
                      </span>
                    </div>
                    {autoAddons.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary/80">Stay Requirements:</span>
                        {autoAddons.map((addon, i) => (
                          <div key={i} className="flex justify-between items-center text-[11px] bg-secondary/5 p-3 rounded-xl border border-secondary/10">
                            <span className="text-secondary font-bold">{addon}</span>
                            <span className="text-secondary font-black">REQUIRED</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="bg-muted" />

                  <div className="pt-4">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Total (INR)
                      </span>
                      <span className="text-4xl font-black text-primary leading-none">
                        ₹{totalPrice.toLocaleString()}
                      </span>
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

const BookingSkeleton = () => (
  <div className="bg-[#fcfcfc] min-h-screen animate-pulse">
    {/* Page Header/Hero Skeleton */}
    <section className="relative h-[40vh] min-h-[400px] w-full bg-gray-200 overflow-hidden">
      <div className="absolute inset-0 bg-gray-300"></div>
      <div className="absolute inset-0 bg-gray-400/20 z-10"></div>
      <div className="container mx-auto px-4 h-full relative z-20 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-[300px] md:w-[500px] bg-gray-300/50 rounded-2xl mx-auto mb-6"></div>
          <div className="h-6 w-[200px] bg-gray-300/30 rounded-full mx-auto"></div>
        </div>
      </div>
    </section>

    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Media & Form */}
        <div className="lg:col-span-8 space-y-12">
          {/* Gallery Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[500px]">
            <div className="lg:col-span-8 bg-gray-200 rounded-[2rem] lg:rounded-[3rem] h-[300px] lg:h-full"></div>
            <div className="lg:col-span-4 grid grid-cols-3 lg:flex lg:flex-col gap-3 md:gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square lg:flex-1 bg-gray-200 rounded-2xl lg:rounded-[2.5rem]"></div>
              ))}
            </div>
          </div>

          {/* Form Card Skeleton */}
          <div className="bg-gray-100/50 rounded-[3rem] p-10 space-y-10 border border-gray-100">
            <div className="space-y-4">
              <div className="h-10 w-1/3 bg-gray-200 rounded-xl"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded-full w-full mt-8"></div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all">
            <div className="bg-gray-300/80 h-32"></div>
            <div className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="h-8 w-2/3 bg-gray-200 rounded-lg"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 pb-4">
                    <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-12 w-32 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingPageContent />
    </Suspense>
  );
}
