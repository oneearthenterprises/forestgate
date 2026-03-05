'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export function HeroScroll() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sticky Reveal Parallax Effects
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div ref={containerRef} className="relative h-[150vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Video with Sticky Reveal Parallax */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0 h-full w-full"
        >
          <div className="absolute inset-0 z-0 h-full w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={heroImage?.imageUrl}
              className="absolute inset-0 w-full h-full object-cover"
            >
              {/* Forest Drone View Video Source */}
              <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-dense-forest-in-the-mountains-34531-large.mp4" type="video/mp4" />
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
          </div>
          {/* Sophisticated Dark Overlay for high-end text contrast */}
          <div className="absolute inset-0 bg-black/30 z-10" />
        </motion.div>

        {/* Centered Content */}
        <motion.div 
          style={{ opacity, y }}
          className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4 text-center text-white"
        >
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "'Sour Gummy', system-ui" }}>
            THE FOREST GATE
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-light tracking-wide mb-10 opacity-90">
            Luxury meets nature in the heart of Himachal. Experience tranquility like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button asChild className="h-14 px-0 bg-white hover:bg-slate-50 text-slate-900 rounded-full overflow-hidden flex group border-none shadow-2xl transition-all p-1">
              <Link href="/booking" className="flex items-center h-full">
                <span className="px-8 flex items-center justify-center h-full uppercase tracking-[0.2em] font-black text-xs">Book Your Stay</span>
                <div className="h-full aspect-square bg-primary flex items-center justify-center rounded-full transition-all group-hover:scale-105">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10 rounded-full px-10">
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 flex flex-col items-center gap-2 opacity-70"
          >
            <span className="text-sm uppercase tracking-widest font-bold">Scroll to explore</span>
            <ChevronDown className="h-6 w-6 text-secondary" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
