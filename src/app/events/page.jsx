
'use client';

import * as React from 'react';
import Image from "next/image";
import Link from 'link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, SendHorizontal } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

export default function EventsPage() {
    const bannerImage = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2000";

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const autoplay = React.useMemo(
        () => (typeof Autoplay === 'function' ? Autoplay({ 
          delay: 3000, 
          stopOnInteraction: false,
          stopOnMouseEnter: true
        }) : null),
        []
    );

    const highlights = [
        { name: "Balloons", img: "balloons", hint: "party balloons" },
        { name: "Dessert Table", img: "dessert", hint: "dessert table" },
        { name: "Confetti", img: "confetti", hint: "heart confetti" },
        { name: "Table Setting", img: "table", hint: "wedding table" },
        { name: "Neon Signs", img: "neon", hint: "neon sign" },
        { name: "Floral Decor", img: "flowers", hint: "event flowers" },
        { name: "Gourmet Catering", img: "catering", hint: "gourmet food" }
    ];

    return (
        <div className="bg-[#fcfcfc] overflow-x-hidden">
            {/* BOUTIQUE HERO BANNER */}
            <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
                <Image 
                    src={bannerImage}
                    alt="Event Celebration"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30" />

                {/* Floating Decorative Dots */}
                <div className="absolute top-[20%] left-[15%] w-4 h-4 bg-[#ff5722] rounded-full blur-[1px] animate-pulse" />
                <div className="absolute top-[22%] left-[15%] w-4 h-4 bg-white rounded-full blur-[1px]" />
                <div className="absolute top-[15%] right-[20%] w-5 h-5 bg-[#ffeb3b] rounded-full blur-[1px]" />
                <div className="absolute bottom-[25%] right-[30%] w-6 h-6 bg-[#e91e63] rounded-full blur-[1px]" />
                <div className="absolute bottom-[23%] right-[30%] w-6 h-6 bg-white rounded-full blur-[1px]" />

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-[10rem] font-bold text-white leading-none tracking-tighter uppercase drop-shadow-2xl font-playfair">
                            Celebrations
                        </h1>
                        
                        <div className="flex flex-col items-end md:mr-20 -mt-2 md:-mt-6">
                            <p className="font-kaushan text-3xl md:text-5xl text-white drop-shadow-lg">
                                & bespoke curation
                            </p>
                            {/* Wavy Line SVG */}
                            <svg className="w-48 md:w-72 h-4 text-white mt-2" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 10C25 10 25 2 50 2C75 2 75 18 100 18C125 18 125 2 150 2C175 2 175 18 200 18C225 18 225 2 250 2C275 2 275 10 300 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* BOUTIQUE TYPOGRAPHY SECTION */}
            <section className="bg-white py-24 md:py-40 overflow-hidden border-y border-slate-100">
                <div className="container mx-auto px-4 flex flex-col items-center text-[#eb5e28]">
                    {/* Line 1 */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full flex justify-center lg:justify-start lg:pl-20"
                    >
                        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
                            Balloon Styling
                        </h2>
                    </motion.div>

                    {/* Line 2 */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-8 lg:mt-0"
                    >
                        <p className="font-kaushan text-2xl md:text-5xl text-[#eb5e28]/70 italic lowercase">
                            We've got everything cov_
                        </p>
                        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
                            Classic Arch
                        </h2>
                    </motion.div>

                    {/* Line 3 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-end lg:pr-20 gap-4 md:gap-12 mt-8 lg:mt-4"
                    >
                        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
                            Party banner
                        </h2>
                        <Link href="/gallery" className="group font-kaushan text-2xl md:text-5xl text-[#eb5e28]/70 italic flex items-center gap-3 hover:text-[#eb5e28] transition-colors">
                            Look for more 
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SEAMLESS ATMOSPHERE CAROUSEL */}
            <section className="bg-[#0b2c3d] py-0 overflow-hidden relative group">
                <Carousel 
                    opts={{ align: "start", loop: true }}
                    plugins={autoplay ? [autoplay] : []}
                    className="w-full"
                >
                    <CarouselContent className="-ml-0">
                        {highlights.map((item, idx) => (
                            <CarouselItem key={idx} className="pl-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                                <div className="relative h-[600px] overflow-hidden border-r border-white/5">
                                    <Image 
                                        src={`https://picsum.photos/seed/${item.img}/600/1000`} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                        data-ai-hint={item.hint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-10 left-0 right-0 text-center px-4">
                                        <h3 className="text-white text-2xl font-bold tracking-tight drop-shadow-md">
                                            {item.name}
                                        </h3>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Navigation Buttons - Visible on hover */}
                    <div className="absolute top-1/2 left-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border-none text-white hover:bg-secondary hover:text-black shadow-2xl transition-all" />
                    </div>
                    <div className="absolute top-1/2 right-6 z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl border-none text-white hover:bg-secondary hover:text-black shadow-2xl transition-all" />
                    </div>
                </Carousel>
            </section>

            {/* CUSTOM PROMO SUBSCRIPTION SECTION */}
            <section className="relative bg-[#003d82] py-24 md:py-40 overflow-hidden">
                {/* Decorative Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 flex flex-col gap-0"
                >
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#eb5e28] rounded-full" />
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full -mt-2" />
                </motion.div>

                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-10 md:right-32 top-20 w-6 h-6 md:w-10 md:h-10 bg-[#ffeb3b] rounded-full shadow-[0_0_20px_rgba(255,235,59,0.5)]" 
                />

                <div className="absolute right-20 md:right-40 bottom-20">
                    <div className="relative">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-[#ff80ab] to-white rounded-full blur-[2px]" />
                        <div className="absolute inset-0 bg-white/40 rounded-full blur-xl scale-150 animate-pulse" />
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
                        <div className="space-y-4">
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/80">
                                10% OFF CONGRATS PROMO <br className="md:hidden" /> CODES FOR NOVEMBER 2025
                            </p>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight tracking-tight">
                                15% Off Your Next <br className="hidden md:block" /> Visit By Subscribing
                            </h2>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <form className="relative group flex items-center border border-white/30 h-16 md:h-20 bg-white/5 backdrop-blur-sm transition-all focus-within:border-white/60">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    className="flex-1 bg-transparent border-none outline-none px-6 md:px-10 text-white placeholder:text-white/40 text-sm md:text-lg font-medium"
                                    required
                                />
                                <div className="h-10 w-px bg-white/20 mx-2" />
                                <button 
                                    type="submit" 
                                    className="w-20 md:w-28 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                >
                                    <div className="relative">
                                        <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
