'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, Maximize2, Waves, Bed, Bath } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { allocateRooms } from '@/lib/utils/allocation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {  galleryImages } from '../lib/data';
import { PlaceHolderImages } from '../../lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ManagedBySection } from '@/components/shared/ManagedBySection';
import { RoomCarouselWrapper } from '@/components/shared/RoomCarouselWrapper';
import { API } from '@/lib/api/api';

function RoomsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const adults = searchParams.get('guests') || '2';
  const childrenCount = searchParams.get('children') || '0';
  
  const numAdults = parseInt(adults);
  const numChildren = parseInt(childrenCount);

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const headerImage = PlaceHolderImages.find((img) => img.id === 'room-suite-1');

  useEffect(() => {
    getApiRooms();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

const getApiRooms = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(API.GetAllRooms, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const getRoomsData = await response.json();

    setRooms(getRoomsData.rooms);

    console.log(getRoomsData.rooms);
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};



  const RoomSkeleton = () => (
    <div className="bg-card border border-border/50 rounded-[2.5rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-8 animate-pulse">
      {/* Left: Image Skeleton */}
      <div className="w-full md:w-[35%] aspect-[4/5] bg-slate-100 rounded-[2rem] shrink-0" />

      {/* Middle: Content Skeleton */}
      <div className="flex-1 space-y-4 py-2 w-full">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-slate-100 rounded-full" />
          <div className="h-10 w-2/3 bg-slate-100 rounded-xl" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 rounded-md" />
          <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-dashed border-slate-100">
          <div className="space-y-2">
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-6 w-24 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-6 w-24 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Right: Actions Skeleton */}
      <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 md:min-w-[180px] md:pl-6 md:border-l md:border-dashed md:border-slate-100 items-center md:items-start">
        <div className="h-12 w-full max-w-[160px] bg-slate-100 rounded-full" />
        <div className="h-10 w-24 bg-slate-100 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfc]">
      {headerImage && (
        <PageHeader
          title="Our Accommodations"
          subtitle="Explore the luxurious rooms and suites included when you book the entire resort."
          imageUrl={headerImage.imageUrl}
          imageHint={headerImage.imageHint}
        />
      )}

      <section>
        <div className="container mx-auto px-4">
          <Tabs defaultValue="accommodations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-16 h-14 p-1.5 rounded-full bg-muted/50 border border-border/50">
              <TabsTrigger 
                value="accommodations" 
                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg"
              >
                Accommodations
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg"
              >
                Gallery
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="accommodations" className="mt-0">
              <motion.div {...fadeInUp} className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">
                  Experience Private Luxury
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  For ultimate privacy and a truly bespoke experience, book
                  the entire The Forest Gate. You'll get exclusive access to
                  all our accommodations and world-class amenities.
                </p>
                <Button asChild size="lg" className="rounded-full px-12 shadow-none">
                  <Link href="/booking" className="flex items-center gap-2">
                    Book Entire Resort <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              {/* 🔹 Dynamic Guest Search Bar */}
              <div className="max-w-4xl mx-auto mb-16 bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                  <div className="space-y-1.5 w-full sm:w-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adults (12+ Yrs)</p>
                    <Select 
                      value={adults} 
                      onValueChange={(val) => {
                        const params = new URLSearchParams(searchParams);
                        params.set('guests', val);
                        router.push(`?${params.toString()}`, { scroll: false });
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                        <SelectValue placeholder="Adults" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {[...Array(11)].map((_, i) => (
                          <SelectItem key={i+1} value={String(i+1)} className="font-medium">{i+1} {i === 0 ? 'Adult' : 'Adults'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 w-full sm:w-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Children (0-11 Yrs)</p>
                    <Select 
                      value={childrenCount} 
                      onValueChange={(val) => {
                        const params = new URLSearchParams(searchParams);
                        params.set('children', val);
                        router.push(`?${params.toString()}`, { scroll: false });
                      }}
                    >
                      <SelectTrigger className="w-full sm:w-32 h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                        <SelectValue placeholder="Children" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {[...Array(11)].map((_, i) => (
                          <SelectItem key={i} value={String(i)} className="font-medium">{i} {i === 1 ? 'Child' : 'Children'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:border-l md:border-dashed border-slate-200 md:pl-8 text-center md:text-left w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Group Size</p>
                   <p className="font-headline text-3xl font-bold text-slate-900">{numAdults + numChildren} Guests</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                {isLoading ? (
                  <>
                    <RoomSkeleton />
                    <RoomSkeleton />
                    <RoomSkeleton />
                    <RoomSkeleton />
                  </>
                ) : (
                  rooms.map((room, index) => (
                    <motion.div
                     key={room._id}
                      {...fadeInUp}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-card border border-border/50 rounded-[2.5rem] overflow-hidden p-4 md:p-6 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 hover:border-primary/20"
                    >
                      {/* Left: Image/Carousel */}
                      <div className="w-full md:w-[35%] shrink-0">
                        <RoomCarouselWrapper room={room} />
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 space-y-4 py-2 min-w-0">
                        <div className="space-y-1">
                          <Badge variant="outline" className="rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-900 shadow-sm mb-2">
                            {room.tag || 'Premium Stay'}
                          </Badge>
                          <h3 className="font-headline text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                          {(() => {
                            const allocation = numAdults > 0 ? allocateRooms(numAdults, numChildren, room.pricePerNight) : null;
                            const totalRooms = allocation ? allocation.totalRooms : 1;
                            return totalRooms > 1 ? `${totalRooms} x ${room.roomName}` : room.roomName;
                          })()}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 py-1">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Maximize2 className="w-4 h-4" />
                            <span className="text-xs font-bold">144 sq.ft (13 sq.mt)</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Waves className="w-4 h-4" />
                            <span className="text-xs font-bold">Swimming Pool View</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Bed className="w-4 h-4" />
                            <span className="text-xs font-bold">1 King Bed</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Bath className="w-4 h-4" />
                            <span className="text-xs font-bold">1 Bathroom</span>
                          </div>
                        </div>

                        {numAdults > 0 && numAdults + numChildren > 1 && (
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Room Allocation Breakdown</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                              {allocateRooms(numAdults, numChildren, room.pricePerNight).allocatedRooms.map((r, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 whitespace-nowrap">Room {i + 1}:</span>
                                  <span className="text-xs font-medium text-slate-600">
                                    {r.adults} Adults {r.children > 0 ? `+ ${r.children} ${r.children === 1 ? 'Child' : 'Children'}` : ''}
                                    {r.extraBedding ? ' (+ Extra Bed)' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-foreground/60 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-2 break-all">
                          {room.shortDescription}
                        </p>

                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-dashed border-slate-200">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Price per night</p>
                            <p className="font-headline text-2xl sm:text-3xl font-black text-[#5e774a]">₹{room.pricePerNight.toLocaleString()}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Key Amenities</p>
                            <p className="font-headline text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-tight">
                              {room.amenities?.join(', ') || 'Mountain View'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 md:min-w-[180px] md:pl-6 md:border-l md:border-dashed items-center md:items-start">
                        <Button asChild className="rounded-full bg-[#82c244] hover:bg-[#70a83a] text-white font-bold w-full max-w-[160px] border-none shadow-lg transition-transform hover:scale-105 active:scale-95">
                          <Link href={`/booking?roomId=${room._id}&guests=${adults}&children=${childrenCount}`}>Book Now</Link>
                        </Button>
                        <Button asChild variant="ghost" className="h-12 font-bold text-sm hover:bg-muted/50 group/btn w-full">
                        <Link href={`/rooms/${room._id}`} className="flex items-center justify-center gap-2">
                            See Details
                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {galleryImages.map((image) => {
                  const imageData = PlaceHolderImages.find(
                    (p) => p.id === image.id
                  );
                  if (!imageData) return null;
                  return (
                    <div key={image.id} className="break-inside-avoid">
                      <Image
                        src={imageData.imageUrl}
                        alt={imageData.description}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-[2rem] shadow-none transition-transform duration-500 hover:scale-[1.02]"
                        data-ai-hint={imageData.imageHint}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <ManagedBySection 
        label="Himalayan Hospitality"
        title="Managed By The Forest Authority"
        description="Experience luxury curated by the guardians of the mountains. Our partnerships ensure every stay contributes to the preservation of Himachal's ancient forest trails and biodiversity."
        buttonText="Explore Sanctuary"
        buttonLink="/experiences"
        imageSrc="/assets/images/dearimage.png"
        imageAlt="Forest Sanctuary"
      />
    </div>
  );
}

export default function RoomsClient() {
  return (
    <Suspense fallback={
      <div className="bg-[#fcfcfc] min-h-screen">
        <div className="container mx-auto px-4 py-32 animate-pulse">
          <div className="h-10 w-48 bg-slate-100 rounded-full mx-auto mb-8" />
          <div className="h-4 w-96 bg-slate-100 rounded-full mx-auto mb-16" />
          <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-50 rounded-[2.5rem] border border-slate-100" />
            ))}
          </div>
        </div>
      </div>
    }>
      <RoomsPageContent />
    </Suspense>
  );
}
