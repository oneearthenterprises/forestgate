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
        <Card className="group overflow-hidden border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-500 rounded-3xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Icon Badge */}
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                    <Icon className="w-7 h-7" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-headline text-3xl font-bold mb-3 drop-shadow-md">
                        {amenity.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 line-clamp-3">
                        {amenity.description}
                    </p>
                    <div className="w-12 h-1 bg-primary mt-4 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
            </div>
        </Card>
    );
}
