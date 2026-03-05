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
import { wildlifeViewpoints } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PawPrint } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

export function WildlifeCarousel() {
  const sectionLabelStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 'normal',
  };

  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section id="wildlife" className="bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="max-w-3xl mb-16">
          <p className="mb-2" style={sectionLabelStyle}>Natural Sanctuary</p>
          <h2 className="text-3xl md:text-5xl mb-4 font-headline">
            Wildlife & Animal Viewpoints
          </h2>
          <p className="text-foreground/60 text-lg leading-relaxed font-light">
            Our resort is nestled in a rich ecosystem. Experience the thrill of observing indigenous Himalayan wildlife in their natural habitat.
          </p>
        </div>

        <div className="relative w-full mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.play}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {wildlifeViewpoints.map((point, index) => {
                const imageData = PlaceHolderImages.find(img => img.id === point.image);
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-card h-[500px] shadow-lg transition-all duration-500 hover:shadow-2xl border border-border/50">
                      {/* Background Image */}
                      {imageData && (
                        <Image
                          src={imageData.imageUrl}
                          alt={point.title}
                          fill
                          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                          data-ai-hint={point.imageHint}
                        />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      {/* Decorative Icon Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white shadow-xl">
                          <PawPrint className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="font-headline text-3xl font-bold text-white mb-3 tracking-tight">
                          {point.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed line-clamp-4 font-light">
                          {point.description}
                        </p>
                        <div className="w-12 h-1 bg-[#fcb101] mt-6 rounded-full" />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="-left-12 h-10 w-10 shadow-sm border-none bg-muted/50 hover:bg-muted" />
              <CarouselNext className="-right-12 h-10 w-10 shadow-sm border-none bg-muted/50 hover:bg-muted" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
