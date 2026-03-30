"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, differenceInDays, addDays, isWithinInterval, areIntervalsOverlapping, startOfDay, endOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { allocateRooms, costManager, minRooms } from "@/lib/utils/allocation";
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
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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
      name: z.string().optional(),
      gender: z.string().default("Male"),
      age: z.string().optional(),
      type: z.enum(["Adult", "Child"]),
    })).optional(),
    provideDetailsLater: z.boolean().default(false),
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
  const [isCustomAdults, setIsCustomAdults] = useState(false);
  const [isCustomChildren, setIsCustomChildren] = useState(false);
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
      children: searchParams.get("children") || "0",
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


  // 🔹 Use the new user-provided allocation and pricing logic
  const allocation = useMemo(() => {
    if (!room || numAdults < 1) return { allocatedRooms: [], totalRooms: 0, totalPrice: 0 };
    
    // 1. Get the base allocation requirements (how many rooms/beddings needed)
    const { rooms: neededRooms, beddings: neededBeddings, allocatedRooms } = minRooms(numAdults, numChildren);
    
    // 2. Map requirements to actual room instances (Primary + Selected Suggestions)
    // Priority: selectedAdditionalRooms, then fallback to primary room
    let baseTotal = 0;
    const finalAllocatedRooms = (allocatedRooms || []).map((r, index) => {
      // Pick room type: Suggestion if available for this slot, else Primary
      // IMPORTANT: To treat suggestions as changes/substitutions, we pick from selectedAdditionalRooms if available
      const currentRoomType = (selectedAdditionalRooms && selectedAdditionalRooms[index]) || room;
      
      const rPrice = currentRoomType.pricePerNight;
      const bPrice = currentRoomType.extraBeddingPrice;
      const roomTotal = rPrice + (r.extraBedding ? bPrice : 0);
      
      baseTotal += roomTotal;
      
      return { 
        ...r, 
        name: currentRoomType.roomName, 
        price: roomTotal,
        roomId: currentRoomType._id || currentRoomType.id 
      };
    });

    return {
      allocatedRooms: finalAllocatedRooms,
      totalRooms: neededRooms,
      totalBeddings: neededBeddings,
      totalPrice: baseTotal,
    };
  }, [numAdults, numChildren, room, selectedAdditionalRooms]);

  const couponCode = ""; // Placeholder for coupon logic if needed
  
  // Total price logic that respects the new mixed allocation
  const finalTotalPrice = useMemo(() => {
    if (!room) return 0;
    
    const baseWithNights = allocation.totalPrice * numNights;
    const discount = baseWithNights * 0.10; // 10% multi-room/primary discount
    const withTax = (baseWithNights - discount) * 1.18; // 18% GST
    
    return withTax;
  }, [allocation, numNights, room]);

  // Price breakdown for display
  const basePrice = allocation.totalPrice * numNights;
  const discountAmount = basePrice * 0.10;
  const priceAfterDiscount = basePrice - discountAmount;
  const gstAmount = priceAfterDiscount * 0.18;
  
  const totalRoomsNeeded = allocation.totalRooms;

  const autoAddons = useMemo(() => {
    const addons = [];
    if (allocation.allocatedRooms.some(r => r.extraBedding)) {
      addons.push("Extra Bedding Required");
    }
    return addons;
  }, [allocation]);

  // 🔹 Capacity Check for manual recommendations
  const isCapacityExceeded = (numAdults > 2 && numChildren > 1) || numAdults > 3 || numChildren > 2;

  const { executeRecaptcha } = useGoogleReCaptcha();

  async function onSubmit(data) {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      // Fallback or handle appropriately
    }

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
      totalPrice: finalTotalPrice,
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
        body: JSON.stringify({
          ...bookingData,
          recaptchaToken: executeRecaptcha ? await executeRecaptcha('booking') : null
        }),
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
      params.append("totalPrice", finalTotalPrice.toString());
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:mb-16 mb-4 h-auto lg:h-[600px]">
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

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 min-w-0">
              <div className="md:mb-12 mb-3">
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

                <p className="text-foreground/70 text-xl leading-relaxed md:mb-12 mb-6 font-light">
                  {room?.fullDescription}
                </p>

                <Separator className="md:mb-12 mb-6" />

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
                  {/* 🔹 Interactive Guest Summary Bar (New) */}
                  <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                      <div className="space-y-1.5 w-full sm:w-auto">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adults (12+ Yrs)</p>
                        {isCustomAdults ? (
                          <div className="flex items-center gap-2">
                             <Input 
                                type="number" 
                                min="1" 
                                value={adults}
                                onChange={(e) => form.setValue("adults", e.target.value)}
                                className="h-12 w-24 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                             />
                             <Button variant="ghost" size="sm" onClick={() => { setIsCustomAdults(false); form.setValue("adults", "2"); }} className="h-12 w-12 rounded-2xl">×</Button>
                          </div>
                        ) : (
                          <Select 
                            value={adults} 
                            onValueChange={(val) => {
                              if (val === "custom") {
                                setIsCustomAdults(true);
                                form.setValue("adults", "12");
                              } else {
                                form.setValue("adults", val);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                              <SelectValue placeholder="Adults" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                              {[...Array(11)].map((_, i) => (
                                <SelectItem key={i+1} value={String(i+1)} className="font-medium">{i+1} {i === 0 ? 'Adult' : 'Adults'}</SelectItem>
                              ))}
                              <SelectItem value="custom" className="font-bold text-primary">12+ (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="space-y-1.5 w-full sm:w-auto">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Children (0-11 Yrs)</p>
                        {isCustomChildren ? (
                           <div className="flex items-center gap-2">
                              <Input 
                                 type="number" 
                                 min="0" 
                                 value={children}
                                 onChange={(e) => form.setValue("children", e.target.value)}
                                 className="h-12 w-24 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                              />
                              <Button variant="ghost" size="sm" onClick={() => { setIsCustomChildren(false); form.setValue("children", "0"); }} className="h-12 w-12 rounded-2xl">×</Button>
                           </div>
                        ) : (
                          <Select 
                            value={children} 
                            onValueChange={(val) => {
                              if (val === "custom") {
                                setIsCustomChildren(true);
                                form.setValue("children", "12");
                              } else {
                                form.setValue("children", val);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                              <SelectValue placeholder="Children" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                              {[...Array(11)].map((_, i) => (
                                <SelectItem key={i} value={String(i)} className="font-medium">{i} {i === 1 ? 'Child' : 'Children'}</SelectItem>
                              ))}
                              <SelectItem value="custom" className="font-bold text-primary">12+ (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    <div className="md:border-l md:border-dashed border-slate-200 md:pl-8 text-center md:text-left w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Group Size</p>
                       <p className="font-headline text-3xl font-bold text-slate-900">{numAdults + numChildren} Guests</p>
                    </div>
                  </div>
                  <Card
                    ref={formRef}
                    className="border-none shadow-none bg-primary/20 rounded-[3rem]"
                  >
                    <CardHeader className="p-6 md:p-10">
                      <CardTitle className="font-headline text-3xl md:text-4xl font-bold mb-2">
                        Booking Contact Details
                      </CardTitle>
                      <CardDescription className="text-base md:text-lg">
                        Please provide contact details for this reservation. Note: This will not change your main account profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                                        "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm w-full",
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
                                      // Auto-set checkout to next day
                                      const nextDay = addDays(date, 1);
                                      form.setValue("checkOut", nextDay);
                                      // Auto-open checkout calendar
                                      setTimeout(() => setCheckOutOpen(true), 150);
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
                                        "h-16 rounded-2xl justify-start text-left font-bold text-base bg-background border-none shadow-sm w-full",
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <FormField
                          control={form.control}
                          name="adults"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2">
                                Number of Adults
                              </FormLabel>
                              {isCustomAdults ? (
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      className="h-16 rounded-2xl bg-background border-none shadow-sm px-6 font-bold" 
                                    />
                                  </FormControl>
                                  <Button variant="ghost" onClick={() => { setIsCustomAdults(false); form.setValue("adults", "2"); }} className="h-16 w-16 rounded-2xl">×</Button>
                                </div>
                              ) : (
                                <Select
                                  onValueChange={(val) => {
                                    if (val === "custom") {
                                      setIsCustomAdults(true);
                                      form.setValue("adults", "12");
                                    } else {
                                      field.onChange(val);
                                    }
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-16 rounded-2xl bg-background border-none shadow-sm text-gray">
                                      <Users className="h-4 w-4 text-secondary mr-2" />
                                      <SelectValue placeholder="Adults" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[...Array(11)]
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
                                    <SelectItem value="custom" className="font-bold text-primary">12+ (Custom)</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
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
                              {isCustomChildren ? (
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      className="h-16 rounded-2xl bg-background border-none shadow-sm px-6 font-bold" 
                                    />
                                  </FormControl>
                                  <Button variant="ghost" onClick={() => { setIsCustomChildren(false); form.setValue("children", "0"); }} className="h-16 w-16 rounded-2xl">×</Button>
                                </div>
                              ) : (
                                <Select
                                  onValueChange={(val) => {
                                    if (val === "custom") {
                                      setIsCustomChildren(true);
                                      form.setValue("children", "12");
                                    } else {
                                      field.onChange(val);
                                    }
                                  }}
                                  value={field.value}
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
                                    <SelectItem value="custom" className="font-bold text-primary">12+ (Custom)</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* 🔹 Room Capacity Suggestions (New) */}
                      {isCapacityExceeded && allRooms.length > 0 && (
                        <div className="bg-primary/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-primary/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <ArrowRightCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-headline text-xl font-bold">Sanctuary Capacity Suggestions</h4>
                              <p className="text-sm text-muted-foreground font-medium">Your selection exceeds one room's capacity. We've found the best deals for your additional guests:</p>
                            </div>
                          </div>

                          <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent className="-ml-4">
                               {allRooms.map((r, i) => (
                                <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2">
                                  <div className="bg-white p-4 h-full flex rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm flex flex-row items-center justify-between gap-4 group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4 w-full">
                                      <div className="w-16 h-16 rounded-2xl relative overflow-hidden bg-slate-100 shrink-0">
                                        {r.images?.[0] && <Image src={r.images[0].url} fill className="object-cover" alt={r.roomName} />}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-sm line-clamp-1">{r.roomName}</p>
                                        <p className="text-primary font-black text-xs">₹{r.pricePerNight.toLocaleString()}/night</p>
                                      </div>
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant={selectedAdditionalRooms.some(sr => sr._id === r._id) ? "default" : "ghost"} 
                                      className={`rounded-full w-10 h-10 p-0 shrink-0 ${selectedAdditionalRooms.some(sr => sr._id === r._id) ? "bg-primary text-white" : "hover:bg-primary/10 text-primary"}`}
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
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <div className="flex items-center justify-center gap-4 mt-6">
                              <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white" />
                              <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white" />
                            </div>
                          </Carousel>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-secondary" />
                            Guest Profiles
                          </h3>
                          <FormField
                            control={form.control}
                            name="provideDetailsLater"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 transition-all hover:bg-secondary/20 cursor-pointer" onClick={() => field.onChange(!field.value)}>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0b2c3d]">Provide Later</span>
                                    <div className={cn(
                                      "w-8 h-4 rounded-full relative transition-colors duration-200",
                                      field.value ? "bg-secondary" : "bg-slate-300"
                                    )}>
                                      <div className={cn(
                                        "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all duration-200 shadow-sm",
                                        field.value ? "left-0.5 translate-x-4" : "left-0.5"
                                      )} />
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground bg-white/50 p-4 rounded-xl border border-white/20 font-medium">
                          {form.watch("provideDetailsLater") 
                            ? "You've chosen to provide details later. An admin will contact you to collect this information before your stay."
                            : "Please provide details for each guest. This helps us prepare the right bedding and amenities for your sanctuary stay."}
                        </p>
                        
                        {!form.watch("provideDetailsLater") && (
                          <div className="space-y-4">
                            {guestDetailsWatch.map((guest, idx) => (
                            <div key={idx} className="bg-white/40 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/30 space-y-4">
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
                                        <Input 
                                          {...field} 
                                          placeholder="Guest name" 
                                          className="h-16 rounded-2xl bg-white border-none shadow-sm px-6" 
                                        />
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
                                            <SelectTrigger className="h-16 rounded-2xl bg-white border-none shadow-sm px-6">
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
                                          <Input 
                                            type="number" 
                                            {...field} 
                                            onChange={(e) => {
                                              const ageVal = e.target.value;
                                              const age = parseInt(ageVal);
                                              field.onChange(ageVal);
                                              if (!isNaN(age)) {
                                                const newType = age >= 6 ? "Adult" : "Child";
                                                const oldType = guest.type;
                                                if (newType !== oldType) {
                                                  form.setValue(`guestDetails.${idx}.type`, newType);
                                                  // Bidirectional Sync: Update Top Selectors
                                                  if (newType === "Adult" && oldType === "Child") {
                                                    form.setValue("adults", String(numAdults + 1));
                                                    form.setValue("children", String(numChildren - 1));
                                                  } else if (newType === "Child" && oldType === "Adult") {
                                                    form.setValue("adults", String(numAdults - 1));
                                                    form.setValue("children", String(numChildren + 1));
                                                  }
                                                }
                                              }
                                            }}
                                            className="h-16 rounded-2xl bg-white border-none shadow-sm px-6" 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {/* Hidden Type field since it's now auto-calculated */}
                                  <FormField
                                    control={form.control}
                                    name={`guestDetails.${idx}.type`}
                                    render={({ field }) => (
                                      <FormItem className="hidden">
                                        <FormControl>
                                          <Input {...field} type="hidden" />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        "w-full h-16 rounded-full text-lg font-black uppercase tracking-widest shadow-none group transition-all text-sm",
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

            <aside className="w-full lg:w-[380px] shrink-0 sticky top-24 self-start">
              <Card className="border-none shadow-none overflow-hidden rounded-[3rem] bg-card">
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

                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        Room Allocation Price
                      </span>
                      <span className="font-black text-foreground">
                        ₹{basePrice.toLocaleString()}
                      </span>
                    </div>
                    {totalRoomsNeeded > 1 && (
                      <div className="flex flex-col gap-1 pt-1">
                        {allocation.allocatedRooms.map((r, i) => (
                          <div key={i} className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Room {i+1}: {r.name} ({r.adults}A, {r.children}C{r.extraBedding ? " + Bed" : ""})</span>
                            <span>₹{(r.price * numNights).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        Discount (10%)
                      </span>
                      <span className="font-bold text-green-600">
                        −₹{discountAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">
                        GST (18%)
                      </span>
                      <span className="font-bold text-foreground">
                        +₹{Math.round(gstAmount).toLocaleString()}
                      </span>
                    </div>
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
                  </div>

                  <Separator className="bg-muted" />

                  <div className="pt-4">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Total (INR)
                      </span>
                      <span className="text-4xl font-black text-primary leading-none">
                        ₹{Math.round(finalTotalPrice).toLocaleString()}
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
