'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { amenities } from '@/app/lib/data';
import { AmenityCard } from '@/components/shared/AmenityCard';
import Autoplay from 'embla-carousel-autoplay';

export function AmenitiesCarousel() {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
    align: 'start',
    loop: true
  }), []);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel 
      setApi={setApi} 
      opts={carouselOpts} 
      plugins={plugins}
      className="w-full relative"
    >
      <CarouselContent className="-ml-4">
        {amenities.map((amenity, index) => {
          return (
            <CarouselItem key={index} className="pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                  <AmenityCard amenity={amenity} />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute -top-24 md:-top-16 right-0 flex items-center gap-4">
        <p className="text-lg font-medium text-muted-foreground tabular-nums">
          <span className="font-bold text-foreground">{String(current).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          {String(count).padStart(2, '0')}
        </p>
        <div className="hidden md:flex items-center gap-2">
            <CarouselPrevious className="relative -translate-y-0 left-auto right-auto top-auto" />
            <CarouselNext className="relative -translate-y-0 left-auto right-auto top-auto" />
        </div>
      </div>
    </Carousel>
  );
}
