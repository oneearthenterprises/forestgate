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

export function HighlightsCarouselWrapper({ highlightsWithImages }) {
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
    loop: true,
  }), []);

  if (!highlightsWithImages || highlightsWithImages.length === 0) {
    return null;
  }

  return (
    <Carousel 
      opts={carouselOpts} 
      plugins={plugins}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {highlightsWithImages.map((highlight) => (
          <CarouselItem key={highlight.title} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
            <div className="flex flex-col items-center gap-4 group py-12">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-[150px] md:h-[150px] overflow-hidden rounded-full shadow-2xl transition-all duration-500 group-hover:scale-105 border-4 border-white/10">
                {highlight.image && (
                  <Image
                    src={highlight.image.imageUrl}
                    alt={highlight.title}
                    fill
                    className="object-cover"
                    data-ai-hint={highlight.image.imageHint}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                  />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-base md:text-xl font-bold tracking-tight text-foreground transition-colors duration-300">
                  {highlight.title}
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-none bg-white/30 text-white hover:bg-white/50" />
      <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-none bg-white/30 text-white hover:bg-white/50" />
    </Carousel>
  );
}
