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
    <section className="relative min-h-[700px] overflow-hidden flex items-center bg-[#0b2c3d] py-24">
      {/* Static Background Image with Signature Gradient */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1591384387119-c7420bf514d8?auto=format&fit=crop&q=80&w=1920"
          alt="Himachal Background"
          fill
          className="object-cover opacity-20 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c3d] via-[#0b2c3d]/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
        {/* Static Title Header */}
        <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fcb101]/10 border border-[#fcb101]/20 text-[#fcb101] text-xs font-black uppercase tracking-widest mb-6">
                Discovery Hub
            </div>
            <h2 className="font-headline text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                Explore <span className="text-[#fcb101]">Himachal</span> <br/>
                <span className="italic font-light text-white/50 text-4xl md:text-5xl">Destinations</span>
            </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-16 w-full">
          {/* Left: Static Location Points Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {destinations.map((dest, idx) => (
                <div key={dest.id} className="space-y-6 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#fcb101] flex items-center justify-center font-black text-black shadow-xl shadow-[#fcb101]/20 transform transition-transform group-hover:rotate-6">
                            0{idx + 1}
                        </div>
                        <h3 className="font-headline text-3xl font-bold text-white tracking-tight">
                            {dest.title}
                        </h3>
                    </div>
                    <div className="pl-16 space-y-4 border-l border-white/10">
                        {dest.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-3 group/item">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fcb101] scale-0 group-hover/item:scale-100 transition-transform duration-300" />
                                <span className="text-lg text-white/60 font-light hover:text-white transition-all duration-300 cursor-default tracking-wide transform group-hover/item:translate-x-1">
                                    {point}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
          </div>

          {/* Right: Static Map Outline with high-end glassmorphism */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full max-w-[500px] aspect-square flex items-center justify-center p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10"
            >
              <div className="relative w-full h-full">
                 <Image 
                    src="/assets/images/harnayaimage.png" 
                    alt="Himachal Map Outline" 
                    fill 
                    className="object-contain filter invert brightness-200 opacity-40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    data-ai-hint="map outline"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x600/000000/FFFFFF/png?text=Himachal+Map";
                    }}
                 />
                 {/* Visual markers on the map */}
                 <div className="absolute top-[35%] left-[55%] w-4 h-4 bg-[#fcb101] rounded-full animate-pulse shadow-[0_0_20px_#fcb101] z-20" />
                 <div className="absolute top-[45%] left-[45%] w-2 h-2 bg-white rounded-full opacity-50 z-20" />
                 <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-white rounded-full opacity-50 z-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
