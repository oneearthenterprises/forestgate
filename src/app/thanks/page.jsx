'use client';

import Link from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LinkNext from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ThankYouPage() {
    return (
        <div className="my-20">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                className=" "
            >
                <div className="flex flex-col md:flex-row items-center max-w-2xl">
                    {/* Centered Lottie Animation */}
                    <div className="w-full max-w-[600px] h-[600px] mb-6">
                        <DotLottieReact
                          src="/assets/lootiefiles/Man holding banner (_Thank You_ ).json"
                          loop
                          autoplay
                        />
                    </div>
                    <div>

                   
                    
                    <h1 className="font-headline text-5xl md:text-7xl font-bold text-secondary mb-4 tracking-tight">Namaste!</h1>
                    
                    <div className="font-playfair text-2xl md:text-3xl text-slate-400 italic mb-8 overflow-hidden min-h-[1.5em]">
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
                    
                    <div className="w-16 h-[2px] bg-[#085d6b]/20 mb-10 rounded-full mx-auto" />
                    
                    <p className="text-black-500 text-base md:text-lg leading-relaxed mb-14 max-w-sm mx-auto font-light">
                        We're delighted to have you. You are now part of our inner circle and will receive exclusive stories and offers from the heart of the Himalayas.
                    </p>
                    
                    <div className="flex justify-center w-full">
                        <Button asChild className="h-14 px-12 rounded-full bg-primary hover:bg-primary/80 text-white transition-all hover:shadow-xl group">
                            <LinkNext href="/" className="flex items-center gap-2 hover:text-white">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
