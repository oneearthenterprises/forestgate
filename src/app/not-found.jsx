'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * Redesigned 404 Not Found Page
 * Focused on the Lottie animation for a clean, modern feel.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-20">
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Hero Lottie Animation */}
        <div className="flex justify-center">
          <div className="relative w-72 h-72 md:w-[400px] md:h-[400px]">
            <DotLottieReact
              src="/assets/lootiefiles/Error 404.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight leading-tight">
            Lost in the <span className="text-secondary">Wilds?</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
            The trail you followed seems to have vanished. Let's get you back to the sanctuary of The Forest Gate.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button asChild size="lg" className="h-16 px-10 rounded-full font-bold shadow-xl transition-all hover:scale-[1.03] active:scale-95 w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-full font-bold border-2 transition-all hover:bg-muted/50 w-full sm:w-auto">
            <Link href="/contact" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Contact Concierge
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle Branding Watermark */}
      <div className="absolute bottom-8 left-0 right-0 text-center opacity-20 pointer-events-none select-none">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
          The Forest Gate • Village Tandeo. Morni Hills, Panchkula, Haryana
        </p>
      </div>
    </div>
  );
}
