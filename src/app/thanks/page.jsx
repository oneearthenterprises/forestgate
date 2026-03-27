'use client';

import Link from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LinkNext from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ThankYouPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-3xl w-full text-center"
            >
                <div className="flex flex-col items-center">
                    {/* Centered Lottie Animation */}
                    <div className="w-full max-w-[500px] h-[400px] md:h-[500px] mb-8">
                        <DotLottieReact
                          src="/assets/lootiefiles/Man holding banner (_Thank You_ ).json"
                          loop
                          autoplay
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <h1 className="font-headline text-5xl md:text-8xl font-bold text-secondary tracking-tight">Namaste!</h1>
                        
                        <div className="font-playfair text-2xl md:text-3xl text-slate-400 italic overflow-hidden min-h-[1.5em] px-4">
                            {Array.from("Thank you for joining our sanctuary.").map((char, index) => (
                                <motion.span
                                    key={`${char}-${index}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 1, 0] }}
                                    transition={{
                                        duration: 4,
                                        delay: index * 0.08,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                        
                        <div className="w-16 h-[2px] bg-[#085d6b]/20 mx-auto rounded-full" />
                        
                        <p className="text-slate-600 text-base md:text-xl leading-relaxed max-w-xl mx-auto font-light px-4">
                            We're delighted to have you. You are now part of our inner circle and will receive exclusive stories and offers from the heart of the Himalayas.
                        </p>
                        
                        <div className="pt-8">
                            <Button asChild className="h-16 px-14 rounded-full bg-primary hover:bg-primary/90 text-white transition-all hover:shadow-2xl hover:scale-105 group text-lg">
                                <LinkNext href="/" className="flex items-center gap-3">
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                                    Back to Home
                                </LinkNext>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subtle background circles for depth */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-[#085d6b]/3 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-[#085d6b]/3 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
