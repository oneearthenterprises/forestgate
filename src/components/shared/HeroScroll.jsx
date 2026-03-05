'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroScroll() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline();
      
      tl.fromTo(contentRef.current, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.3 }
      );

      // 2. Scroll-Linked Parallax Effect (The Scrub)
      gsap.to(videoRef.current, {
        y: "20%", // Subtle video parallax
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scale: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "80% top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 h-[120%] w-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={heroImage?.imageUrl}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          {/* Forest Drone View Video Source */}
          <source src="https://assets.mixkit.co/videos/preview/kit-drone-view-of-a-dense-forest-in-the-mountains-34531-large.mp4" type="video/mp4" />
          {/* Fallback to Image if video fails */}
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="The Forest Gate Sanctuary"
              fill
              priority
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </video>
        {/* Sophisticated Dark Overlay for high-end text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
      </div>

      {/* Centered Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center px-4 text-center text-white">
        <div
          ref={contentRef}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-2xl" style={{ fontFamily: "'Sour Gummy', system-ui" }}>
            THE FOREST GATE
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide mb-10 opacity-90 drop-shadow-md">
            Luxury meets nature in the heart of Himachal. Experience tranquility like never before in our sustainable Himalayan sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-transform active:scale-95">
              <Link href="/booking" className="flex items-center gap-2">
                Book Your Stay <ArrowUpRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white border-2 hover:bg-white/10 rounded-full px-12 h-16 text-lg font-bold backdrop-blur-sm transition-all active:scale-95">
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 flex flex-col items-center gap-2 opacity-70"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/80">Scroll to explore</span>
          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 text-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
