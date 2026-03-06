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
            const roomImage = PlaceHolderImages.find((img) => img.id === room.images[0]);
            return (
                <CarouselItem key={room.id} className="basis-full sm:basis-1/2 pl-4">
                    <div className="p-1">
                        <Link
                            href={`/rooms/${room.id}`}
                            className="relative block group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full"
                        >
                            {roomImage && (
                                <Image
                                    src={roomImage.imageUrl}
                                    alt={room.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={roomImage.imageHint}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
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
                                <h3 className="font-headline text-3xl font-bold">{room.name}</h3>
                                <p className="text-lg">₹{room.price.toLocaleString()} / per night</p>
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
                            </div>
                        </Link>
                    </div>
                </CarouselItem>
            );
        })}
        <CarouselItem className="basis-full sm:basis-1/2 pl-4">
            <div className="p-1 h-full">
                <Link
                    href="/rooms"
                    className="relative group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full block h-full"
                >
                    <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                        {seeMoreImages.slice(0,4).map((image, index) => (
                            image && (
                                <div key={index} className="relative h-full w-full overflow-hidden">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <h4 className="font-headline text-2xl font-bold">See more</h4>
                        <p>+10 more</p>
                    </div>
                </Link>
            </div>
        </CarouselItem>
      </CarouselContent>
      <div className="flex justify-center mt-8 gap-2">
          <CarouselPrevious className="static translate-y-0"/>
          <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}