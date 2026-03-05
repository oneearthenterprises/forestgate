'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MountainSnow, ArrowLeft, Compass } from 'lucide-react';
import Image from 'next/image';

/**
 * Custom 404 Not Found Page
 * Designed to feel like an extension of the resort's serene mountain theme.
 */
export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-background">
      {/* Decorative background watermark */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
        <span className="text-[25rem] font-bold font-headline leading-none">404</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-10">
        {/* Animated Icon Badge */}
        <div className="flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative flex items-center justify-center w-24 h-24 bg-card border border-border/50 rounded-[2rem] shadow-xl rotate-12 transition-transform hover:rotate-0 duration-500">
                    <Compass className="w-12 h-12 text-primary animate-spin-[spin_10s_linear_infinite]" />
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-bold font-headline text-foreground tracking-tight leading-none">
                Lost in the <span className="text-secondary">Wilds?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
                Even the most seasoned explorers occasionally wander off the trail. Don't worry—your sanctuary at The Forest Gate is just a click away.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button asChild size="lg" className="h-16 px-10 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Sanctuary
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-full font-bold border-2 transition-all hover:bg-muted/50">
            <Link href="/contact">Contact Concierge</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Mist Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
      
      {/* Subtle Bottom Image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-[21/9] opacity-[0.08] grayscale pointer-events-none z-10">
         <Image 
            src="https://picsum.photos/seed/misty-mountains/1200/500"
            alt="Misty Mountain Range"
            fill
            className="object-cover"
            data-ai-hint="misty mountain"
         />
      </div>
    </div>
  );
}
