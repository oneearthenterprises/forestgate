
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function ManagedBySection() {
    const palmImage = PlaceHolderImages.find(img => img.id === 'palm-tree-banner');

    return (
        <section className="relative overflow-hidden bg-[#70ac43] py-16 md:py-24">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl space-y-6">
                    <div className="space-y-2">
                        <p className="text-[#1a1a1a] font-bold text-xl md:text-2xl font-body">
                            Managed By
                        </p>
                        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-body">
                            The State Forest Development Agency (SFDA), Kerala
                        </h2>
                    </div>
                    
                    <div className="space-y-6 pt-4">
                        <p className="text-[#1a1a1a] text-base md:text-lg font-medium font-body opacity-80">
                            Visit SFDA Webpage
                        </p>
                        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-14 shadow-none font-bold text-base transition-all active:scale-[0.98]">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decorative Palm Tree Asset */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 lg:w-2/5 pointer-events-none hidden md:block">
                {palmImage && (
                    <div className="relative w-full h-full">
                        <Image
                            src={palmImage.imageUrl}
                            alt="Palm tree decoration"
                            fill
                            className="object-contain object-right-bottom scale-125 translate-x-12 translate-y-12"
                            data-ai-hint={palmImage.imageHint}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
