'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
        {/* Background Image with Sticky Reveal Parallax */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0 h-full w-full"
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Himachal Haven Hero"
              fill
              priority
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50 z-10" />
        </motion.div>

        {/* Centered Content */}
        <motion.div 
          style={{ opacity, y }}
          className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4 text-center text-white bg-primary/20"
        >
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "'Sour Gummy', system-ui" }}>
            THE FOREST GATE
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-light tracking-wide mb-10 opacity-90">
            Luxury meets nature in the heart of Himachal. Experience tranquility like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link href="/booking">Book Your Stay</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 flex flex-col items-center gap-2 opacity-70"
          >
            <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
