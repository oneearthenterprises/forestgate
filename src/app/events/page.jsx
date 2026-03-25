'use client';

import * as React from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BoutiqueTypography } from '@/components/shared/BoutiqueTypography';
import { AtmosphereCarousel } from '@/components/shared/AtmosphereCarousel';
import { API } from '@/lib/api/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const bannerImage = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2000";

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(API.newsletteremail, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok || res.status === 201) {
                toast({
                    title: "Success",
                    description: "You have been subscribed to our newsletter!",
                });
                setEmail("");
                router.push("/thanks");
            } else if (res.status === 409) {
                toast({
                    title: "Note",
                    description: "This email is already subscribed.",
                });
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to subscribe. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Connection error. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <h1 className="text-4xl sm:text-6xl md:text-[10rem] font-bold text-white leading-none tracking-tighter uppercase drop-shadow-2xl font-playfair">
                            Celebrations
                        </h1>
                        
                        <div className="flex flex-col items-end md:mr-20 -mt-2 md:-mt-6">
                            <p className="font-kaushan text-2xl md:text-5xl text-white drop-shadow-lg">
                                & bespoke curation
                            </p>
                            <svg className="w-48 md:w-72 h-4 text-white mt-2" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 10C25 10 25 2 50 2C75 2 75 18 100 18C125 18 125 2 150 2C175 2 175 18 200 18C225 18 225 2 250 2C275 2 275 10 300 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* BOUTIQUE TYPOGRAPHY COMPONENT */}
            <BoutiqueTypography />

            {/* SEAMLESS ATMOSPHERE CAROUSEL */}
            <AtmosphereCarousel />

            {/* CUSTOM PROMO SUBSCRIPTION SECTION */}
            <section className="relative bg-[#003d82] py-24 md:py-40 overflow-hidden">
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 flex flex-col gap-0"
                >
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-secondary rounded-full" />
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full -mt-2" />
                </motion.div>

                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-10 md:right-32 top-20 w-6 h-6 md:w-10 md:h-10 bg-secondary rounded-full shadow-[0_0_20px_rgba(252,177,1,0.5)]" 
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
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white leading-tight tracking-tight">
                                10% Off Your Next <br className="hidden md:block" /> Visit By Subscribing
                            </h2>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSubscribe} className="relative group flex items-center border border-white/30 h-16 md:h-20 bg-white/5 backdrop-blur-sm transition-all focus-within:border-white/60">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email" 
                                    className="flex-1 bg-transparent border-none outline-none px-6 md:px-10 text-white placeholder:text-white/40 text-sm md:text-lg font-medium"
                                    required
                                />
                                <div className="h-10 w-px bg-white/20 mx-2" />
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-20 md:w-28 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                                >
                                    <div className="relative">
                                        <ArrowRight className={`w-6 h-6 md:w-8 md:h-8 ${isSubmitting ? 'animate-pulse' : ''}`} />
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
