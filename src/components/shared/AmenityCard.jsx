'use client';

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";
import { Waves, Sparkles, Sun, Bike, HeartHandshake } from 'lucide-react';

const icons = {
    waves: Waves,
    sparkles: Sparkles,
    sun: Sun,
    bike: Bike,
    'heart-handshake': HeartHandshake,
};

export function AmenityCard({ amenity }) {
    const amenityImage = PlaceHolderImages.find(
        (img) => img.id === amenity.image
    );
    const Icon = icons[amenity.iconName] || Sparkles;
    
    return (
        <Card className="group overflow-hidden border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-500 rounded-[2.5rem]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                {/* Base Image */}
                {amenityImage && (
                    <Image
                        src={amenityImage.imageUrl}
                        alt={amenity.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={amenityImage.imageHint}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                    />
                )}
                
                {/* The Signature Gradient Overlay (Green at bottom, fading to transparent top) */}
                <div 
                    className="absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to top, #70ac43 0%, rgba(112, 172, 67, 0.6) 40%, transparent 100%)' }}
                ></div>
                
                {/* Icon Badge - Top Right - Turns Secondary on Hover */}
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transition-all duration-500 group-hover:scale-110 group-hover:bg-secondary group-hover:border-secondary group-hover:text-black shadow-lg">
                    <Icon className="w-7 h-7" />
                </div>

                {/* Content Overlay - Text always visible at the bottom */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <h3 className="font-headline text-3xl md:text-4xl font-bold mb-3 drop-shadow-md leading-tight">
                        {amenity.title}
                    </h3>
                    <p className="text-white/95 leading-relaxed line-clamp-3 font-medium text-sm md:text-base mb-6 drop-shadow-sm">
                        {amenity.description}
                    </p>
                    
                    {/* The signature white line at the bottom */}
                    <div className="w-16 h-1.5 bg-white rounded-full opacity-90 shadow-sm transition-all duration-500 group-hover:w-24"></div>
                </div>
            </div>
        </Card>
    );
}
