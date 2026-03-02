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
    <section className="relative min-h-[800px] overflow-hidden flex flex-col items-center justify-center bg-[#0b2c3d] py-32 px-4">
      {/* Cinematic Blurred Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1591384387119-c7420bf514d8?auto=format&fit=crop&q=80&w=1920"
          alt="Himachal Background"
          fill
          className="object-cover opacity-40 blur-[8px] scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl h-full flex flex-col items-center">
        {/* Centered Creative Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-[#fcb101] tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
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
              className="relative w-full max-w-[550px] aspect-square flex items-center justify-center p-12 bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="relative w-full h-full">
                 <Image 
                    src="/assets/images/harnayaimage.png" 
                    alt="Himachal Map Outline" 
                    fill 
                    className="object-contain filter invert brightness-200 opacity-60 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    data-ai-hint="map outline"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x600/000000/FFFFFF/png?text=Map+Location";
                    }}
                 />
                 {/* Visual markers/glow on the map area */}
                 <div className="absolute top-[40%] left-[50%] w-6 h-6 bg-[#fcb101] rounded-full animate-pulse shadow-[0_0_30px_#fcb101] z-20" />
                 <div className="absolute top-[35%] left-[45%] w-3 h-3 bg-white rounded-full opacity-40 z-20" />
                 <div className="absolute top-[50%] left-[55%] w-2 h-2 bg-white rounded-full opacity-40 z-20" />
              </div>
              
              {/* Subtle Scanline Overlay for map feel */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
