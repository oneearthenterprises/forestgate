'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Users, Heart, Briefcase, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutClient() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'about-resort');

    const features = [
        {
            icon: Leaf,
            title: "Eco-Friendly Environment",
            description: "We are committed to sustainability, with green practices integrated into every aspect of our operations to preserve the pristine beauty of Haryana."
        },
        {
            icon: Users,
            title: "Ideal for Couples & Families",
            description: "Whether you're on a romantic getaway or a family vacation, our resort offers tailored experiences and spaces for unforgettable memories."
        },
        {
            icon: Heart,
            title: "Calm & Peaceful Location",
            description: "Our secluded location, away from the crowds, ensures a tranquil, pollution-free atmosphere for complete relaxation and rejuvenation."
        },
        {
            icon: Briefcase,
            title: "Corporate Events",
            description: "Inspire your team with our state-of-the-art facilities set against a backdrop of stunning natural landscapes, perfect for productive retreats."
        },
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, ease: "easeOut" }
    };

  return (
    <div className="bg-[#fcfcfc] overflow-x-hidden">
        {headerImage && <PageHeader title="About The Forest Gate" subtitle="A Story of Passion and Nature" imageUrl={headerImage.imageUrl} imageHint={headerImage.imageHint} />}

        {/* Our Story Section */}
        <motion.section {...fadeInUp} className="overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles className="w-3 h-3" />
                            Our Journey
                        </div>
                        <h2 className="font-headline text-4xl md:text-6xl font-bold mb-8 leading-tight">Our Story</h2>
                        <p className="text-xl text-foreground/70 mb-8 font-light leading-relaxed">
                        The Forest Gate was born from a dream to create a luxurious sanctuary that lives in harmony with nature. Our founders, with a deep love for the Morni Hills, envisioned a place where guests could escape the chaos of city life.
                        </p>
                        <div className="p-8 bg-muted/30 rounded-3xl border-l-4 border-[#fcb101]">
                            <p className="text-lg text-foreground/80 font-light leading-relaxed italic">
                            "Built on the principles of eco-consciousness and responsible tourism, every corner of our resort is designed to offer comfort while minimizing our ecological footprint."
                            </p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                            <Image
                                src="https://picsum.photos/seed/founder/600/700"
                                alt="Resort Founders"
                                width={600}
                                height={700}
                                className="rounded-[3rem] shadow-2xl aspect-[3/4] object-cover relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                                data-ai-hint="portrait nature"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* NEW SECTION: IT'S ALL ABOUT TRAVEL */}
        <motion.section {...fadeInUp} className="bg-white py-24 md:py-32 overflow-hidden border-y border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-12 md:space-y-16">
                    
                    {/* Line 1: IT'S ALL + Image */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-12 w-full justify-center lg:justify-start lg:pl-20">
                        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-slate-900 uppercase">IT'S ALL</h2>
                        <div className="relative w-24 h-14 sm:w-40 sm:h-24 md:w-64 md:h-36 lg:w-[450px] lg:h-[220px] bg-pink-100 rounded-3xl sm:rounded-[3rem] overflow-hidden shrink-0 shadow-xl rotate-3">
                            <Image 
                                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800" 
                                alt="Backpacker" 
                                fill 
                                className="object-cover"
                                data-ai-hint="travel backpacker"
                            />
                        </div>
                    </div>

                    {/* Line 2: Image + ABOUT */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-12 w-full justify-center">
                        <div className="relative w-24 h-14 sm:w-40 sm:h-24 md:w-64 md:h-36 lg:w-[450px] lg:h-[220px] bg-blue-100 rounded-3xl sm:rounded-[3rem] overflow-hidden shrink-0 shadow-xl -rotate-2">
                            <Image 
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800" 
                                alt="Traveler with passport" 
                                fill 
                                className="object-cover"
                                data-ai-hint="traveler passport"
                            />
                        </div>
                        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-slate-900 uppercase">ABOUT</h2>
                    </div>

                    {/* Line 3: TRAVEL + Image */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-12 w-full justify-center lg:justify-end lg:pr-20">
                        <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-slate-900 uppercase">TRAVEL</h2>
                        <div className="relative w-24 h-14 sm:w-40 sm:h-24 md:w-64 md:h-36 lg:w-[450px] lg:h-[220px] bg-orange-100 rounded-3xl sm:rounded-[3rem] overflow-hidden shrink-0 shadow-xl rotate-2">
                            <Image 
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800" 
                                alt="Traveling couple" 
                                fill 
                                className="object-cover"
                                data-ai-hint="travel couple"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </motion.section>

        <motion.section {...fadeInUp} className="bg-muted/20 py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                        Key Pillars
                     </div>
                     <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6">Why Choose Us?</h2>
                     <p className="text-lg text-foreground/60 font-light leading-relaxed">
                        We offer more than just a stay; we offer an experience. A chance to unwind, explore, and create memories in a place that feels like a home away from home.
                     </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div 
                            key={feature.title} 
                            className="bg-background p-10 rounded-[2.5rem] shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col items-start text-left h-full border border-border/50"
                        >
                            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#fcb101] group-hover:shadow-lg group-hover:shadow-[#fcb101]/20 transition-all duration-500">
                                <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-foreground/60 text-sm leading-relaxed font-light">
                                {feature.description}
                            </p>
                            <div className="w-12 h-1 bg-primary/20 mt-8 rounded-full group-hover:bg-primary group-hover:w-20 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    </div>
  );
}
