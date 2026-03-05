'use client';

import Image from "next/image";
import Link from "next/link";

/**
 * PageHeader - A premium, reusable banner component used across the site.
 * Adopts the high-end style of the original Privacy banner with breadcrumbs and torn edges.
 * 
 * @param {string} title - The main heading text.
 * @param {string} subtitle - Optional secondary text.
 * @param {string} imageUrl - Background image URL.
 * @param {string} breadcrumbLabel - Optional label for the breadcrumb (defaults to title).
 */
export function PageHeader({ title, subtitle, imageUrl, breadcrumbLabel }) {
  // Use a high-impact default background if none is provided
  const background = imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";

  return (
    <section
      className="relative h-[70vh] min-h-[450px] flex items-center justify-center text-center text-white bg-fixed bg-center bg-cover pt-16 overflow-hidden"
      style={{
        backgroundImage: `url('${background}')`,
      }}
    >
      {/* Dark Signature Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b2c3d]/90 via-[#0b2c3d]/80 to-[#0b2c3d]/70 z-10"></div>

      {/* Main Content Area */}
      <div className="relative z-20 px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-tight mb-6 drop-shadow-lg font-headline">
          {title}
        </h1>

        {/* Dynamic Breadcrumbs */}
        <div className="mt-4 text-sm md:text-base font-medium flex items-center justify-center gap-3">
          <Link href="/" className="text-[#fcb101] hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px] md:text-xs font-black">
            Home
          </Link>
          <span className="text-white/30 font-light">|</span>
          <span className="text-white/90 uppercase tracking-[0.2em] text-[10px] md:text-xs font-black">
            {breadcrumbLabel || title}
          </span>
        </div>
        
        {subtitle && (
            <p className="max-w-2xl mx-auto text-lg md:text-xl mt-10 opacity-80 font-light leading-relaxed"
               style={{ color: '#ffae3e', fontFamily: '"Kaushan Script", cursive', fontSize: '32px', fontStyle: 'normal', fontWeight: 400 }}>
                {subtitle}
            </p>
        )}
      </div>

      {/* Signature Decorative Element: Torn Shape Layer */}
      <div className="absolute bottom-0 left-0 w-full z-20 h-[150px] md:h-[250px] pointer-events-none rotate-[180deg]">
        <div className="relative w-full h-full">
            <Image
                src="/assets/images/shape8.png"
                alt="decorative torn edge"
                fill
                className="object-cover object-top"
                priority
                onError={(e) => {
                    // Fallback to a high-res placeholder pattern if the asset is missing
                    e.currentTarget.src = "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1200";
                }}
            />
        </div>
      </div>
    </section>
  );
}
