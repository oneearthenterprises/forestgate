'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const destinations = [
  {
    id: 'naggar',
    title: 'Naggar',
    points: ['Naggar Castle', 'Roerich Art Gallery', 'Jana Waterfall'],
  },
  {
    id: 'manali',
    title: 'Manali',
    points: ['Hadimba Temple', 'Old Manali', 'Vashisht Hot Springs'],
  },
  {
    id: 'solang',
    title: 'Solang Valley',
    points: ['Paragliding', 'Ziplining', 'Solang Ropeway'],
  }
];

export function InteractiveMapSection() {
  return (
    <section className="relative  overflow-hidden flex flex-col items-center justify-center bg-[#0b2c3d] py-10 px-4">
      {/* Cinematic Blurred Background */}
      <div className="absolute inset-0 z-0">
  <video
    src="/assets/videos/pecockwalking.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  />
</div>

      <div className="container relative z-10 mx-auto max-w-7xl h-full flex flex-col items-center">
        {/* Centered Creative Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight ">
                Explore Himalayan Destinations
            </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 w-full">
          {/* Left: Vertical Timeline Style List */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="relative border-l-2 border-white/30 pl-12 py-4 space-y-16">
                {destinations.map((dest, idx) => (
                    <div key={dest.id} className="relative group">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[57px] top-2 w-4 h-4 rounded-full bg-white border-4 border-[#0b2c3d] shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20 group-hover:scale-125 transition-transform duration-300" />
                        
                        <div className="space-y-4">
                            <h3 className="font-headline text-4xl font-bold text-white tracking-tight drop-shadow-md">
                                {dest.title}
                            </h3>
                            <div className="space-y-2">
                                {dest.points.map((point, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#fcb101]" />
                                        <span className="text-lg text-white/80 font-light tracking-wide">
                                            {point}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Right: Glassmorphism Map Outline */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full max-w-[550px] aspect-square flex items-center justify-center  overflow-hidden"
            >
              <div className="relative w-full h-[500px] ">
                 <Image 
                    src="/assets/images/harnayaimage.png" 
                    alt="Himachal Map Outline" 
                    fill 
                    className="object-contain h-[550px] "
                 
                 />
              
              </div>
              
            
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
