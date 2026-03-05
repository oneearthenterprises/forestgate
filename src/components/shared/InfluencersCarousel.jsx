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
import { influencers } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Instagram, Play } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

export function InfluencersCarousel() {
  const sectionLabelStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 'normal',
  };

  const autoplay = React.useMemo(
    () => (typeof Autoplay === 'function' ? Autoplay({ delay: 3000, stopOnInteraction: false }) : null),
    []
  );

  const plugins = React.useMemo(() => (autoplay ? [autoplay] : []), [autoplay]);

  return (
    <section id="influencers" className="bg-muted/30">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="max-w-3xl mb-16">
          <p className="mb-2" style={sectionLabelStyle}>Influencers Speak</p>
          <h2 className="text-3xl md:text-5xl mb-4 font-headline">
            Voices of the Sanctuary
          </h2>
          <p className="text-foreground/60 text-lg leading-relaxed font-light">
            Hear from some of the most prominent explorers and creators who have made The Forest Gate their home away from home.
          </p>
        </div>

        <div className="relative w-full mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={plugins}
            onMouseEnter={() => autoplay?.stop?.()}
            onMouseLeave={() => autoplay?.play?.()}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {influencers.map((person, index) => {
                const imageData = PlaceHolderImages.find(img => img.id === person.image);
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-card h-[500px] shadow-lg transition-all duration-500 hover:shadow-2xl border border-border/50">
                      {/* Portrait Image */}
                      {imageData && (
                        <Image
                          src={imageData.imageUrl}
                          alt={person.name}
                          fill
                          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                          data-ai-hint={imageData.imageHint}
                        />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      {/* Play Button Icon Overlay (Visual only) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>

                      {/* Social Badge */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase">
                          <Instagram className="w-3.5 h-3.5" />
                          <span>Instagram</span>
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-white/90 text-sm italic mb-4 leading-relaxed line-clamp-3">
                          "{person.quote}"
                        </p>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {person.name}
                          </h3>
                          <p className="text-[#fcb101] text-xs font-bold tracking-wider uppercase mt-1">
                            {person.handle}
                          </p>
                        </div>
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