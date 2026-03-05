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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from 'embla-carousel-autoplay';

export function RoomCarouselWrapper({ room }) {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <Carousel 
      className="w-full" 
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.play}
    >
      <CarouselContent>
        {room.images.map((imgId) => {
          const img = PlaceHolderImages.find(
            (p) => p.id === imgId
          );
          return (
            <CarouselItem key={imgId}>
              {img && (
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner">
                  <Image
                    src={img.imageUrl}
                    alt={`${room.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={img.imageHint}
                  />
                </div>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}
