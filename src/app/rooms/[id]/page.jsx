'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Check,
  ArrowLeft,
  Users,
  Maximize,
  Wind,
  Coffee,
  Wifi,
  Tv,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { API } from '@/lib/api/api';

const amenityIcons = {
  'Private Balcony': Wind,
  'King Size Bed': Users,
  'Fireplace': Wind,
  'Wi-Fi': Wifi,
  'Room Service': Coffee,
  'Mountain View': Maximize,
  'River View': Wind,
  'Queen Size Bed': Users,
  'HD TV': Tv,
  'Mini Bar': Coffee,
  '2 Bedrooms': Users,
  'Living Area': Maximize,
  'Kitchenette': Coffee,
  'AC': Wind,
  'TV': Tv,
};

export default function RoomDetailPage() {
  const params = useParams();
  const [room, setRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('images');

  useEffect(() => {
    const getRoom = async () => {
      try {
        const response = await fetch(API.getRoomById(params.id));
        const data = await response.json();
        setRoom(data.room);
      } catch (error) {
        console.log(error);
      }
    };

    if (params?.id) {
      getRoom();
    }
  }, [params]);

  if (!room) {
    return (
      <>
        {/* Hero Skeleton */}
        <section className="relative h-[70vh] min-h-[450px] flex items-center justify-center bg-gray-200 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gray-300"></div>
          <div className="absolute inset-0 bg-gray-400/40 z-10"></div>
          <div className="relative z-20 px-4 max-w-5xl mx-auto text-center">
            <div className="h-12 md:h-16 w-72 md:w-[500px] bg-gray-300 rounded mx-auto mb-6"></div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-3 w-12 bg-gray-300 rounded"></div>
              <div className="h-3 w-2 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-8 w-64 md:w-80 bg-gray-300 rounded mx-auto mt-10"></div>
          </div>
        </section>

        {/* Body Skeleton */}
        <div className="bg-[#fcfcfc] pb-24 animate-pulse">
          <section className="pt-16">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <div className="w-full aspect-[16/9] bg-gray-200 rounded-[2.5rem]"></div>
                  <div className="space-y-4">
                    <div className="h-8 w-56 bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="sticky top-20 space-y-6">
                    <div className="h-8 w-40 bg-gray-200 rounded"></div>
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="h-20 bg-gray-200 rounded-3xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  };

  return (
    <div className="bg-[#fcfcfc] pb-24">
      <PageHeader
        title={room.roomName}
        subtitle={room.shortDescription}
        imageUrl={room.images?.[0]?.url || '/fallback.jpg'}
        breadcrumbLabel="Room Details"
      />

      <section className="pt-16">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="mb-12">
            <Button asChild variant="ghost" className="mb-8 hover:bg-muted group">
              <Link href="/rooms" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Accommodations
              </Link>
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <motion.div {...fadeInUp}>
                {/* Media Tab Switcher */}
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      activeTab === 'images'
                        ? 'bg-[#0f172a] text-white shadow-xl scale-105'
                        : 'bg-[#f8fafc] text-[#64748b] hover:bg-slate-100'
                    }`}
                  >
                    Images
                  </button>
                  {room.videos?.length > 0 && (
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        activeTab === 'video'
                          ? 'bg-[#0f172a] text-white shadow-xl scale-105'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-slate-100'
                      }`}
                    >
                      Video Tour
                    </button>
                  )}
                </div>

                {/* Media Content */}
                <div className="relative">
                  {activeTab === 'images' ? (
                    room.images?.length > 0 ? (
                      <Carousel className="w-full" opts={{ loop: true }}>
                        <CarouselContent>
                          {room.images.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                                <Image
                                  src={img.url}
                                  alt={`${room.roomName} ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  priority={idx === 0}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-6 bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40" />
                        <CarouselNext className="right-6 bg-white/20 backdrop-blur-md border-none text-white hover:bg-white/40" />
                      </Carousel>
                    ) : (
                      <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-slate-100">
                        <Image
                          src="/fallback.jpg"
                          alt="fallback"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )
                  ) : (
                    <div className="grid gap-8">
                      {room.videos.map((video, idx) => (
                        <div key={idx} className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 bg-black group transition-all duration-500 hover:scale-[1.01]">
                          <video
                            src={video.url}
                            controls
                            className="w-full h-full object-cover"
                            poster={room.images?.[0]?.url}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="space-y-8">
                <div className="min-w-0">
                  <h2 className="text-4xl font-headline font-black text-slate-900 mb-6 tracking-tight">About the Room</h2>
                  <p className="text-xl text-slate-500 font-light leading-relaxed break-words">
                    {room.fullDescription}
                  </p>
                </div>
                <Separator className="bg-slate-100" />
              </motion.div>
            </div>

            <div className="lg:col-span-4">
              <motion.div {...fadeInUp} className="sticky top-20 space-y-8">
                <h3 className="text-3xl font-headline font-black text-slate-900 tracking-tight">Premium Amenities</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {room.amenities?.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Check;
                    return (
                      <Card
                        key={index}
                        className="flex items-center gap-5 p-5 border-none bg-slate-50/50 rounded-2xl shadow-none transition-all hover:bg-slate-100 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                          <Icon className="w-5 h-5 text-slate-900" />
                        </div>
                        <span className="font-bold text-lg text-slate-700 tracking-tight">
                          {amenity}
                        </span>
                      </Card>
                    );
                  })}
                </div>

                <Button
                  onClick={() => window.location.href = `/booking?roomId=${room._id}`}
                  className="w-full h-16 rounded-full text-[11px] font-black uppercase tracking-[0.2em] bg-[#0f172a] shadow-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book Now Today
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}