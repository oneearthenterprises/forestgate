'use client';

import * as React from 'react';
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

const items = [
    { name: "Poolside Sunset Party", img: "pool-sunset", hint: "pool party" },
    { name: "Bonfire & Acoustic Night", img: "bonfire-night", hint: "bonfire night" },
    { name: "Wellness / Yoga & Detox Retreat Party", img: "yoga-retreat", hint: "yoga retreat" },
    { name: "Cocktail Party", img: "cocktail-party", hint: "cocktail drinks" },
    { name: "Birthday Party", img: "birthday-party", hint: "birthday celebration" },
    { name: "Kity Party", img: "kitty-party", hint: "ladies party" },
    { name: "Corporate Offsite Party", img: "corporate-party", hint: "corporate event" }
];

/**
 * AtmosphereCarousel - A high-impact, seamless editorial carousel.
 * Used to showcase event types and atmospheres with full-height panels.
 */
export function AtmosphereCarousel() {
    const autoplay = React.useMemo(
        () => (typeof Autoplay === 'function' ? Autoplay({ 
          delay: 3000, 
          stopOnInteraction: false,
          stopOnMouseEnter: true
        }) : null),
        []
    );

    return (
        <section className="bg-[#0b2c3d] py-0 overflow-hidden relative group">
            <Carousel 
                opts={{ align: "start", loop: true }}
                plugins={autoplay ? [autoplay] : []}
                className="w-full"
            >
                <CarouselContent className="-ml-0">
                    {items.map((item, idx) => (
                        <CarouselItem key={idx} className="pl-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                            <div className="relative h-[600px] overflow-hidden border-r border-white/5">
                                <Image 
                                    src={`https://picsum.photos/seed/${item.img}/600/1000`} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    data-ai-hint={item.hint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-10 left-0 right-0 text-center px-4">
                                    <h3 className="text-white text-2xl font-bold tracking-tight drop-">
                                        {item.name}
                                    </h3>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {/* Navigation Controls */}
                <div className="absolute top-1/2 left-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border-none text-white hover:bg-secondary hover:text-black  transition-all" />
                </div>
                <div className="absolute top-1/2 right-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border-none text-white hover:bg-secondary hover:text-black  transition-all" />
                </div>
            </Carousel>
        </section>
    );
}
