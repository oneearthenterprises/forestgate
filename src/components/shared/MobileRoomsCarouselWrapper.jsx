'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Flame, Heart, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';

export function MobileRoomsCarouselWrapper({ allRoomsForCarousel, seeMoreImages }) {
  const autoplay = React.useMemo(
    () => (typeof Autoplay === 'function' ? Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true
    }) : null),
    []
  );

  const plugins = React.useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);
  
  const carouselOpts = React.useMemo(() => ({
    align: "start",
    loop: true
  }), []);

  return (
    <Carousel 
      opts={carouselOpts} 
      plugins={plugins}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {allRoomsForCarousel.map((room) => {
            const roomImageUrl = typeof room.images?.[0] === 'string' 
              ? PlaceHolderImages.find((img) => img.id === room.images[0])?.imageUrl 
              : room.images?.[0]?.url;
            
            const roomId = room._id || room.id;
            const roomName = room.roomName || room.name;
            const roomPrice = room.pricePerNight || room.price;

            return (
                <CarouselItem key={roomId} className="basis-full sm:basis-1/2 pl-4">
                    <div className="p-1">
                        <Link
                            href={`/booking?roomId=${roomId}`}
                            className="relative block group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full"
                        >
                            {roomImageUrl && (
                                <Image
                                    src={roomImageUrl}
                                    alt={roomName}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                            {room.badge && (
                                <div
                                    className={`absolute top-4 left-4 flex items-center gap-2 text-white px-3 py-1 rounded-full text-sm font-bold ${
                                        room.badge.variant === 'hot' ? 'bg-red-500/90' : 'bg-purple-500/90'
                                    }`}
                                >
                                    {room.badge.variant === 'liked' ? <Heart size={16} /> : <Flame size={16} />}
                                    <span>{room.badge.label}</span>
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="font-headline text-3xl font-bold">{roomName}</h3>
                                <p className="text-lg">₹{roomPrice?.toLocaleString()} / per night</p>
                                {room.rating && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={
                                                        i < room.rating.stars
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-400'
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold bg-green-600 px-2 py-0.5 rounded">
                                            {room.rating.label}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-8">
                                    <Button className="rounded-full bg-[#82c244] hover:bg-[#70a83a] text-white font-bold h-10 px-8 transition-all border-none">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </div>
                </CarouselItem>
            );
        })}
      </CarouselContent>
      <div className="flex justify-center mt-8 gap-2">
          <CarouselPrevious className="static translate-y-0"/>
          <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}