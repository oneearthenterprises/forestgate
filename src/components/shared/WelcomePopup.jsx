'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomePopup', 'true');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const heroImage = PlaceHolderImages.find(img => img.id === 'about-resort');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white md:text-black md:bg-transparent md:hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Column: Visual & Heading Overlay */}
            <div className="relative w-full md:w-2/5 h-64 md:h-full group">
              <Image
                src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?auto=format&fit=crop&q=80&w=1200"}
                alt="The Forest Gate"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-start">
                <h2 className="text-white text-3xl md:text-4xl font-medium leading-tight mb-6">
                  Book entire rental <br />
                  unit in Naggar, <br />
                  Himachal Pradesh
                </h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-[280px] hidden md:block">
                  Welcome to this stunning sanctuary in the heart of Naggar - Manali, Himachal. 
                  Located at a quiet crossroads, this cozy residence is the perfect combination of comfort and style.
                </p>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center bg-white relative text-slate-900">
              <div className="space-y-8">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 bg-secondary/10 flex items-center justify-center rounded-xl">
                      <MapPin className="w-6 h-6 text-secondary fill-secondary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Naggar, Himachal Pradesh,</p>
                    <p className="text-sm font-medium text-muted-foreground">India</p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-none">
                  The Forest Gate <br />
                  Luxury Villa
                </h1>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-3xl font-bold">₹57,000</span>
                  <span className="text-muted-foreground font-medium">per night</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full px-10">
                    <Link href="/booking">Book Dates</Link>
                  </Button>

                  <Button variant="outline" asChild size="lg" className="rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 px-10 flex gap-2 border-2 shadow-none ring-offset-background transition-all">
                    <Link href="/rooms" className="flex items-center gap-3 h-full">
                      <span>Explore Rooms</span>
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">4.9</span>
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Rating</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">124</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Reviews</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">850+</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Bookings</p>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Links */}
              <div className="absolute bottom-8 right-8 flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                <Link href="/contact" className="hover:text-secondary transition-colors">Leave a review</Link>
                <Link href="/contact" className="hover:text-secondary transition-colors">Contacts</Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
