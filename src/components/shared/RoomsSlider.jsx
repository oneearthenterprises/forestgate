'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Check } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';

export function RoomsSlider({ rooms = [], isLoading = false, className = '' }) {
  // If not loading and no rooms exist in database, do not render any dummy cards
  if (!isLoading && (!rooms || rooms.length === 0)) {
    return null;
  }

  const autoplay = React.useMemo(
    () =>
      typeof Autoplay === 'function' && rooms.length > 1
        ? Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          })
        : null,
    [rooms.length]
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

  return (
    <section className={`py-16 md:py-24 bg-card relative overflow-hidden ${className}`} id="rooms">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <p className="mb-2" style={sectionLabelStyle}>
              Accommodations
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              Our Rooms
            </h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg font-light leading-relaxed">
              Experience sustainable luxury and comfort nestled in the serene Morni Hills.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden sm:inline-flex rounded-full border-primary/30 hover:border-primary">
              <Link href="/rooms" className="flex items-center gap-2">
                <span>View All Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[480px] rounded-3xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="relative group/carousel">
            <Carousel
              opts={{
                align: 'start',
                loop: rooms.length > 1,
              }}
              plugins={autoplay ? [autoplay] : []}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6 py-2">
                {rooms.map((room) => {
                  const roomId = room._id;
                  const roomName = room.roomName;
                  const roomPrice = room.pricePerNight;
                  const imageUrl = room.images?.[0]?.url;
                  const description = room.shortDescription || room.fullDescription;
                  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

                  return (
                    <CarouselItem
                      key={roomId}
                      className={`pl-4 md:pl-6 basis-full ${
                        rooms.length === 1
                          ? 'max-w-xl mx-auto'
                          : rooms.length === 2
                          ? 'sm:basis-1/2 max-w-2xl'
                          : 'sm:basis-1/2 lg:basis-1/3'
                      }`}
                    >
                      <div className="relative h-[520px] rounded-3xl overflow-hidden group/card border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between bg-slate-900">
                        {/* Background Room Image */}
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={roomName || 'Room'}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                          />
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

                        {/* Top Badges */}
                        <div className="relative z-10 p-5 flex items-start justify-between gap-2">
                          {room.tag ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase bg-black/60 backdrop-blur-md border border-white/20 text-[#ffae3e]">
                              <Sparkles className="w-3 h-3 text-[#ffae3e]" />
                              {room.tag}
                            </span>
                          ) : (
                            <span />
                          )}

                          {roomPrice != null && (
                            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#82c244] text-white shadow-md">
                              ₹{roomPrice.toLocaleString()}
                              <span className="font-normal text-[10px] opacity-90">/ night</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Information */}
                        <div className="relative z-10 p-6 flex flex-col justify-end text-white">
                          <h3 className="text-2xl sm:text-3xl font-bold font-headline mb-2 text-white group-hover/card:text-[#ffae3e] transition-colors">
                            {roomName}
                          </h3>

                          {description && (
                            <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-3 font-light leading-relaxed">
                              {description}
                            </p>
                          )}

                          {/* Guests capacity info if available */}
                          {(room.maxAdults || room.maxChildren) && (
                            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-3">
                              <Users className="w-3.5 h-3.5 text-[#ffae3e]" />
                              <span>
                                Up to {room.maxAdults || 2} Adults
                                {room.maxChildren ? `, ${room.maxChildren} Children` : ''}
                              </span>
                            </div>
                          )}

                          {/* Real Amenities from Database */}
                          {amenities.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mb-5">
                              {amenities.slice(0, 3).map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-white/90"
                                >
                                  <Check className="w-3 h-3 text-[#82c244]" />
                                  {typeof amenity === 'string' ? amenity : amenity.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <Button
                              asChild
                              size="sm"
                              className="rounded-xl bg-[#82c244] hover:bg-[#70a83a] text-white font-bold h-11 border-none shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Link href={`/booking?roomId=${roomId}`}>
                                Book Now
                              </Link>
                            </Button>

                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="rounded-xl bg-white/15 hover:bg-white text-white hover:text-black border-white/30 backdrop-blur-md font-semibold h-11 transition-all"
                            >
                              <Link href={`/rooms/${roomId}`} className="flex items-center justify-center gap-1.5">
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Controls (only when multiple rooms exist) */}
              {rooms.length > 1 && (
                <>
                  <div className="flex items-center justify-center gap-3 mt-6 sm:hidden">
                    <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full bg-card hover:bg-primary hover:text-primary-foreground" />
                    <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full bg-card hover:bg-primary hover:text-primary-foreground" />
                  </div>

                  <div className="hidden sm:block">
                    <CarouselPrevious className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-[#ffae3e] hover:text-black text-white border-white/20 backdrop-blur-md shadow-lg transition-all" />
                    <CarouselNext className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/60 hover:bg-[#ffae3e] hover:text-black text-white border-white/20 backdrop-blur-md shadow-lg transition-all" />
                  </div>
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/rooms" className="flex items-center justify-center gap-2">
              <span>View All Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
