'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mountain, Sparkles, MapPin, Compass } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RETREATS_DATA } from '@/app/lib/retreatsData';
import Autoplay from 'embla-carousel-autoplay';

export function RetreatsSlider({ currentSlug = '', title, subtitle, className = '' }) {
  const autoplay = React.useMemo(
    () =>
      typeof Autoplay === 'function'
        ? Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          })
        : null,
    []
  );

  const sectionLabelStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 'normal',
  };

  // If a currentSlug is passed, we still show all or reorder so user can navigate
  const retreats = RETREATS_DATA;

  return (
    <section className={`py-16 md:py-24 bg-[#0a1b24] text-white relative overflow-hidden ${className}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,174,62,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(130,194,68,0.06),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="mb-2" style={sectionLabelStyle}>
              {subtitle || 'Our Sanctuaries & Escapes'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline tracking-tight text-white">
              {title || 'Explore Our Forest Gate Retreats'}
            </h2>
            <p className="text-white/70 mt-3 text-base md:text-lg font-light leading-relaxed">
              Discover six distinct luxury wilderness sanctuaries perched along the Morni Hills
              ridge. Each destination offers its own architectural soul, private vistas, and unforgettable mountain rituals.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#ffae3e] font-semibold flex items-center gap-1.5 mr-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffae3e]" /> 6 Curated Sanctuaries
            </span>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="relative group">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={autoplay ? [autoplay] : []}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6 py-4">
              {retreats.map((retreat) => {
                const isCurrent = currentSlug === retreat.slug || (currentSlug === 'wildwood-retreat' && retreat.slug === 'wildwood_retreat');

                return (
                  <CarouselItem
                    key={retreat.id}
                    className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="relative h-[560px] rounded-3xl overflow-hidden group/card  border border-white/10 transition-all duration-500 hover:border-[#ffae3e]/60 hover:shadow-[#ffae3e]/10 flex flex-col justify-between">
                      {/* Background Image with Zoom */}
                      <Image
                        src={retreat.coverImage}
                        alt={retreat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                      />

                      {/* Multilayered Gradients for readibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1820] via-black/40 to-black/30 opacity-90 transition-opacity group-hover/card:opacity-85" />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/10 transition-colors" />

                      {/* Top Badges */}
                      <div className="relative z-10 p-6 flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-black/60 backdrop-blur-md border border-white/20 text-[#ffae3e]">
                          <Sparkles className="w-3 h-3 text-[#ffae3e]" />
                          {retreat.badge}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md border border-white/15 text-white/90">
                          <Mountain className="w-3 h-3 text-[#82c244]" />
                          {retreat.elevation}
                        </span>
                      </div>

                      {/* Bottom Content */}
                      <div className="relative z-10 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-1.5 text-xs text-[#82c244] font-medium tracking-wide uppercase mb-1">
                          <MapPin className="w-3 h-3" /> Village Tandeo • Morni Hills
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold font-headline text-white mb-2 group-hover/card:text-[#ffae3e] transition-colors">
                          {retreat.name}
                        </h3>

                        <p className="text-sm text-white/80 line-clamp-2 mb-4 leading-relaxed font-light">
                          {retreat.tagline}
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {retreat.highlights.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-white/90 border border-white/10"
                            >
                              {item.label}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={retreat.href}
                          className={`w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl font-bold text-sm transition-all duration-300 ${
                            isCurrent
                              ? 'bg-white/20 text-white border border-white/40 cursor-default'
                              : 'bg-gradient-to-r from-[#ffae3e] to-[#f9b115] hover:from-[#f9b115] hover:to-[#ffae3e] text-black  hover:shadow-[#ffae3e]/30 hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          {isCurrent ? (
                            'Currently Viewing'
                          ) : (
                            <>
                              Explore Sanctuary
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8 md:hidden">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full bg-white/10 hover:bg-[#ffae3e] text-white hover:text-black border-white/20" />
              <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full bg-white/10 hover:bg-[#ffae3e] text-white hover:text-black border-white/20" />
            </div>

            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-5 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#0a1820]/90 backdrop-blur-xl border border-white/20 text-white hover:bg-[#ffae3e] hover:text-black  transition-all" />
              <CarouselNext className="absolute -right-5 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#0a1820]/90 backdrop-blur-xl border border-white/20 text-white hover:bg-[#ffae3e] hover:text-black  transition-all" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
