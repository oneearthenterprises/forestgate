'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const destinations = [
  {
    id: 'naggar',
    title: 'Naggar',
    points: ['Naggar Castle', 'Roerich Art Gallery', 'Jana Waterfall'],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'manali',
    title: 'Manali',
    points: ['Hadimba Temple', 'Old Manali', 'Vashisht Hot Springs'],
    image: 'https://images.unsplash.com/photo-1591384387119-c7420bf514d8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'solang',
    title: 'Solang Valley',
    points: ['Paragliding', 'Ziplining', 'Solang Ropeway'],
    image: 'https://images.unsplash.com/photo-1655469795420-31a4cefc79e4?auto=format&fit=crop&q=80&w=1200',
  }
];

export function InteractiveMapSection() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % destinations.length);
  const prev = () => setIndex((prev) => (prev - 1 + destinations.length) % destinations.length);

  const current = destinations[index];

  return (
    <section className="relative h-[650px] overflow-hidden flex items-center">
      {/* Background with cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover blur-[2px] brightness-[0.35]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
        {/* Centered Title */}
        <div className="text-center mb-20">
          <h2 className="font-headline text-4xl md:text-6xl font-bold text-[#fcb101] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight">
            Explore Himachal Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-6xl mx-auto w-full">
          {/* Left: Location Points with stylized vertical line */}
          <div className="relative pl-16 border-l border-white/20 py-4 space-y-10">
            <motion.div
              key={current.id + '-title'}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative"
            >
              {/* Main Indicator Dot */}
              <div className="absolute -left-[73px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
              <h3 className="font-headline text-5xl md:text-6xl font-bold text-white tracking-tight italic">
                {current.title}
              </h3>
            </motion.div>

            <div className="space-y-8">
              {current.points.map((point, i) => (
                <motion.div
                  key={current.id + i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex items-center gap-4 group/item"
                >
                  {/* Smaller Connectivity Dots */}
                  <div className="absolute -left-[69px] w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300 group-hover/item:scale-150 group-hover/item:bg-[#fcb101] group-hover/item:shadow-[0_0_10px_#fcb101]" />
                  <span className="text-xl md:text-2xl text-white/70 font-light hover:text-white transition-colors cursor-default tracking-wide">
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Map Outline */}
          <div className="flex justify-center lg:justify-end pr-8">
            <motion.div
              key={current.id + '-map'}
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="relative w-full max-w-[450px] aspect-square flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                 <Image 
                    src="/assets/images/harnayaimage.png" 
                    alt="Himachal Map Outline" 
                    fill 
                    className="object-contain filter invert brightness-200 opacity-80"
                    data-ai-hint="map outline"
                    onError={(e) => {
                        // Fallback image if the custom asset is missing
                        e.currentTarget.src = "https://placehold.co/600x600/000000/FFFFFF/png?text=Himachal+Map";
                    }}
                 />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Custom Navigation Controls */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-[#fcb101] transition-all hover:scale-125 active:scale-95 group"
        >
          <ChevronLeft className="w-16 h-16 transition-transform group-hover:-translate-x-2" strokeWidth={1} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-[#fcb101] transition-all hover:scale-125 active:scale-95 group"
        >
          <ChevronRight className="w-16 h-16 transition-transform group-hover:translate-x-2" strokeWidth={1} />
        </button>
      </div>
    </section>
  );
}
