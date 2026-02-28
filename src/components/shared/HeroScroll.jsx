'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HeroScroll() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.8], [0.6, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const imageFilter = useTransform(scrollYProgress, [0, 0.4], ['blur(16px)', 'blur(0px)']);

  const topTextY = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-100%"]);
  const bottomTextY = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <section
      ref={ref}
      className="h-[120vh] bg-white overflow-hidden"
    >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <div className="relative w-[80vw] max-w-5xl h-full flex flex-col items-center justify-center">
                
                <motion.div
                style={{
                    scale: imageScale,
                    opacity: imageOpacity,
                    filter: imageFilter
                }}
                className="absolute w-full max-w-[600px] h-[400px] z-0"
                >
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description || "The Forest Gate"}
                        fill
                        className="object-cover rounded-lg"
                        data-ai-hint={heroImage.imageHint}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                    />
                )}
                </motion.div>

                {/* Top Text */}
                <motion.div
                style={{ y: topTextY }}
                className="h-1/2 flex items-end pb-2 md:pb-4 z-10"
                >
                <h1 className="text-5xl md:text-7xl font-light text-black">
                    The Forest
                </h1>
                </motion.div>

                {/* Bottom Text */}
                <motion.div
                style={{ y: bottomTextY }}
                className="h-1/2 flex items-start pt-2 md:pt-4 z-10"
                >
                <h1 className="text-5xl md:text-7xl font-light text-black">
                    Gate
                </h1>
                </motion.div>

            </div>
      </div>
    </section>
  );
}
