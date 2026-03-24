'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * BoutiqueTypography - A premium, staggered editorial typography component.
 * Used for high-impact visual transitions and branding.
 */
export function BoutiqueTypography() {
  return (
    <section className="bg-white py-24 md:py-40 overflow-hidden border-y border-slate-100">
      <div className="container mx-auto px-4 flex flex-col items-center text-secondary">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center lg:justify-start lg:pl-20"
        >
          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
            Balloon Styling
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-8 lg:mt-0"
        >
          <p className="font-kaushan text-xl md:text-5xl text-secondary/70 italic lowercase">
            We've got everything cov_
          </p>
          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
            Classic Arch
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex flex-col md:flex-row items-center justify-center lg:justify-end lg:pr-20 gap-4 md:gap-12 mt-8 lg:mt-4"
        >
          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-playfair leading-none tracking-tighter">
            Party banner
          </h2>
          <Link
            href="/gallery"
            className="group font-kaushan text-xl md:text-5xl text-secondary/70 italic flex items-center gap-3 hover:text-secondary transition-colors"
          >
            Look for more
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
