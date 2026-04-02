'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const Data = [
  {
    id: 'hero-1',
    title: 'River View',
    imageUrl: '/assets/images/forestgate-image/RIVER VIEW.jpeg',
  },
  {
    id: 'exp-sports',
    title: 'Adventure Activities',
    imageUrl: '/assets/images/forestgate-image/ADVENTURE ACTIVITIES.jpg',
  },
  {
    id: 'exp-pet-friendly',
    title: 'Family & Pet Friendly',
    imageUrl: '/assets/images/forestgate-image/Family & Pet Friendly.jpg',
  },
  {
    id: 'exp-stargazing',
    title: 'Bonfire',
    imageUrl: '/assets/images/forestgate-image/Bonfire.jpg',
  },
  {
    id: 'about-resort',
    title: 'Mountain View',
    imageUrl: '/assets/images/forestgate-image/MOUNTAIN.png',
  },
  {
    id: 'exp-pet-friendly',
    title: 'Family & Pet Friendly',
    imageUrl: '/assets/images/forestgate-image/Family & Pet Friendly.jpg',
  },
];

export function HighlightsCarouselWrapper() {
  const autoplay = Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  return (
    <Carousel
      opts={{ align: 'start', loop: true }}
      plugins={[autoplay]}
      className="w-full"
    >
      <CarouselContent className="-ml-4 gap-3 p-3">
        {Data.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="flex flex-col items-center gap-4 group md:py-12 py-5">
              <div className="relative w-full max-w-[160px] md:max-w-[280px] aspect-[28/41] overflow-hidden rounded-full border-4 border-white/10">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-base md:text-xl font-bold text-center">
                {item.title}
              </h3>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10" />
      <CarouselNext className="hidden md:flex -right-12 h-10 w-10" />
    </Carousel>
  );
}