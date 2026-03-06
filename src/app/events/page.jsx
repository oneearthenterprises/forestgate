
'use client';

import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Heart, Briefcase, PartyPopper, ArrowRight, Sparkles, Star } from "lucide-react";

export default function EventsPage() {
    const bannerImage = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2000";

    const events = [
        {
            title: "Destination Weddings",
            description: "Exchange vows with a breathtaking mountain backdrop. Our team specializes in creating magical, bespoke weddings that reflect your love story. From intimate ceremonies to grand receptions, we handle every detail with precision and grace.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
            imageHint: "mountain wedding",
            icon: Heart
        },
        {
            title: "Corporate Retreats",
            description: "Inspire innovation and foster team spirit in a serene and stimulating environment. Our resort offers modern meeting facilities, customized team-building activities, and comfortable accommodations for a productive getaway.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
            imageHint: "corporate event",
            icon: Briefcase
        },
        {
            title: "Private Celebrations",
            description: "Celebrate your special moments with us. Whether it's a milestone birthday, an anniversary, or a private gathering, we provide the perfect setting, exquisite catering, and personalized service to make it unforgettable.",
            image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200",
            imageHint: "party celebration",
            icon: PartyPopper
        },
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
                        <h1 className="text-6xl md:text-[10rem] font-black text-white leading-none tracking-tighter uppercase drop-shadow-2xl">
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

            {/* VENUES GRID */}
            <section className="bg-primary py-24 md:py-32 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                            <Sparkles className="w-3 h-3 text-secondary" />
                            Elite Spaces
                        </div>
                        <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6">Our Iconic Venues</h2>
                        <p className="text-white/60 text-lg font-light leading-relaxed">
                            Meticulously designed environments that serve as the perfect canvas for your most important moments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "The Mountain Lawn", img: "venue1", hint: "outdoor venue", capacity: "200 Guests" },
                            { name: "The Riverside Hall", img: "venue2", hint: "banquet hall", capacity: "120 Guests" },
                            { name: "The Starlight Terrace", img: "venue3", hint: "terrace party", capacity: "80 Guests" }
                        ].map((venue, idx) => (
                            <div key={idx} className="group relative h-[550px] rounded-[3rem] overflow-hidden shadow-2xl">
                                <Image 
                                    src={`https://picsum.photos/seed/${venue.img}/600/800`} 
                                    alt={venue.name} 
                                    fill 
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    data-ai-hint={venue.hint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent transition-opacity duration-500 opacity-80" />
                                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{venue.capacity}</span>
                                    </div>
                                    <h3 className="font-headline text-3xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {venue.name}
                                    </h3>
                                    <p className="text-white/50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                                        Bespoke arrangements with high-end catering and integrated AV support.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Button asChild size="lg" className="h-16 px-12 rounded-full text-lg font-bold bg-[#fcb101] text-black hover:bg-[#e0a000] border-none shadow-none">
                            <Link href="/contact">Plan Your Event With Us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
