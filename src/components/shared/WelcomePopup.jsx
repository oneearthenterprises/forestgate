'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { API } from '@/lib/api/api';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        const res = await fetch(API.GetWelcomePopup);
        const json = await res.json();
        if (json.success && json.data) {
          setPopupData(json.data);
          
          if (json.data.isActive) {
            const timer = setTimeout(() => {
              const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
              if (!hasSeenPopup) {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenWelcomePopup', 'true');
              }
            }, 1500);
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error("Error fetching welcome popup:", error);
      }
    };
    
    fetchPopupData();
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
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px] max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 md:bg-transparent md:hover:bg-muted rounded-full text-white md:text-black transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Left Column: Visual & Heading Overlay */}
            <div className="relative w-full md:w-2/5 h-56 md:h-full group shrink-0">
              <Image
                src={popupData?.imageUrl || heroImage?.imageUrl || "https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?auto=format&fit=crop&q=80&w=1200"}
                alt="The Forest Gate"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 p-6 md:p-8 flex flex-col justify-start">
                <h2 className="text-white text-2xl md:text-4xl font-medium leading-tight mb-4 md:mb-6 whitespace-pre-line">
                  {popupData?.title || 'Book entire rental\nunit in Naggar,\nHimachal Pradesh'}
                </h2>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-[280px] hidden md:block">
                  {popupData?.description || "Welcome to this stunning sanctuary in the heart of Naggar - Manali, Himachal. Located at a quiet crossroads, this cozy residence is the perfect combination of comfort and style."}
                </p>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            {/* Added scrollbar hiding classes here */}
            <div className="w-full md:w-3/5 p-6 md:p-16 flex flex-col justify-center bg-white relative text-slate-900 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-6 md:space-y-8">
                {/* Location */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="mt-0.5">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary/10 flex items-center justify-center rounded-xl">
                      <MapPin className="w-4 h-4 md:w-6 md:h-6 text-secondary fill-secondary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground leading-tight">{popupData?.location || "Naggar, Himachal Pradesh,"}</p>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">{popupData?.subLocation || "India"}</p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-6xl font-bold text-slate-900 tracking-tight leading-none">
                  The Forest Gate <br />
                  Luxury Villa
                </h1>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl md:text-3xl font-bold">₹{popupData?.price?.toLocaleString() || '57,000'}</span>
                  <span className="text-xs md:text-muted-foreground font-medium">per night</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2 md:pt-4">
                  <Button asChild size="lg" className="w-full md:w-auto rounded-full px-10 h-12 md:h-14">
                    <Link href="/booking">Book Dates</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-slate-100">
                  <div className="space-y-0.5 md:space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-base md:text-lg font-bold">4.9</span>
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-secondary text-secondary" />
                    </div>
                    <p className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground">Rating</p>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-base md:text-lg font-bold">124</p>
                    <p className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground">Reviews</p>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <p className="text-base md:text-lg font-bold">850+</p>
                    <p className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground">Bookings</p>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Links */}
              <div className="mt-8 md:absolute md:bottom-8 md:right-8 flex justify-center md:justify-end gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
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
