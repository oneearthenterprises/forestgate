'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { experiences } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ExperiencesCarousel() {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
    <Carousel setApi={setApi} opts={{ align: 'start', loop: true }} className="w-full relative">
      <CarouselContent className="-ml-4">
        {experiences.map((exp, index) => {
          const expImage = PlaceHolderImages.find((img) => img.id === exp.image);
          return (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                  <Link
                  href="/experiences"
                  className="block relative group overflow-hidden rounded-xl shadow-lg aspect-[3/4]"
                  >
                  {expImage && (
                      <Image
                      src={expImage.imageUrl}
                      alt={exp.title}
                      fill
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={expImage.imageHint}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                      />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-headline text-3xl font-bold">{exp.title}</h3>
                  </div>
                  </Link>
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
