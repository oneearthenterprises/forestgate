'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
import { detailedExperiences } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ExperiencesClient() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'exp-trekking');
    
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div className="bg-[#fcfcfc] overflow-x-hidden">
            {headerImage && (
                <PageHeader
                title="Experiences & Activities"
                subtitle="Embrace adventure, find tranquility, and create lasting memories."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}

            <motion.section {...fadeInUp}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                        {detailedExperiences.map((exp, index) => {
                            const expImage = PlaceHolderImages.find(img => img.id === exp.image);
                            
                            return (
                                <motion.div 
                                    key={exp.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative group overflow-hidden rounded-[2.5rem] bg-card h-[550px] shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/50"
                                >
                                    {/* Background Image */}
                                    {expImage && (
                                        <Image
                                            src={expImage.imageUrl}
                                            alt={exp.title}
                                            fill
                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                            data-ai-hint={expImage.imageHint}
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                        />
                                    )}

                                    {/* Premium Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c3d] via-[#0b2c3d]/40 to-transparent opacity-90 transition-opacity duration-500" />
                                    
                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                                        <h3 className="font-headline text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-md">
                                            {exp.title}
                                        </h3>
                                        
                                        <div className="overflow-hidden">
                                            <p className="text-white/90 text-base leading-relaxed line-clamp-6 font-light">
                                                {exp.description}
                                            </p>
                                        </div>

                                        {/* Stylized Accent Bar */}
                                        <div className="w-16 h-1 bg-[#fcb101] mt-8 rounded-full shadow-sm" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
