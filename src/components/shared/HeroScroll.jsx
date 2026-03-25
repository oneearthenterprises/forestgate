'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";
import { highlights } from "@/app/lib/data";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroScroll() {
  const containerRef = useRef(null);
  const introWrapperRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !introWrapperRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Text Shuffle Animation (Infinite Loop)
      const topNames = gsap.utils.toArray(".text-container-top .service-name");
      const bottomNames = gsap.utils.toArray(".text-container-bottom .service-name");
      
      const masterTL = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

      topNames.forEach((_, index) => {
        const tl = gsap.timeline();
        const targets = [topNames[index], bottomNames[index]];

        tl.set(targets, { opacity: 1 })
          .fromTo(targets, 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
          )
          .to({}, { duration: 1.5 }) // Hold
          .to(targets, {
            y: -40,
            opacity: 0,
            duration: 1,
            ease: "power2.in"
          });

        masterTL.add(tl, index * 3.5);
      });

      // 2. Scroll Reveal Timeline
      const revealTL = gsap.timeline({
        scrollTrigger: {
          trigger: introWrapperRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      revealTL
        .to(".split-layer-top", {
          yPercent: -100,
          duration: 5,
          ease: "power2.inOut"
        }, 0)
        .to(".split-layer-bottom", {
          yPercent: 100,
          duration: 5,
          ease: "power2.inOut"
        }, 0)
        .to(".split-inner-content", {
          opacity: 0,
          scale: 0.9,
          duration: 3,
          ease: "power2.in"
        }, 0)
        .fromTo(".hero-reveal-content", {
          scale: 1.1,
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: 3,
          ease: "power2.out"
        }, 2);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const SplitContent = ({ side }) => (
    <div 
      className="absolute left-0 right-0 w-full h-screen flex flex-col items-center justify-center text-center transition-none"
      style={{ top: side === 'top' ? '0' : '-49.5vh' }}
    >
      <div className="absolute inset-0  bg-primary/20 pointer-events-none">
        <video 
          src="https://res.cloudinary.com/djglckvn7/video/upload/v1774429543/DJI_0109_1_1_zuf45y.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Shutter Linear Gradient (Opens with the split) */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/40 opacity-70"></div>
      </div>
      <div className="split-inner-content relative z-10 w-full max-w-5xl px-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/assets/images/forestgateflatelogo.svg" 
            alt="The Forest Gate" 
            width={100}
            height={100}
            className="h-[20rem] sm:h-[15rem] md:h-[40rem] w-auto drop-shadow-md" 
          />
        </div>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="relative py-10">
      {/* Intro Wrapper (Pinned Section) */}
      <div ref={introWrapperRef} className="relative h-screen w-full overflow-hidden z-30">
        
        {/* SHARED VIDEO BACKGROUND (The core high-end visual) */}
        <div className="absolute inset-0 z-0">
           <video 
              src="https://res.cloudinary.com/djglckvn7/video/upload/v1774429543/DJI_0109_1_1_zuf45y.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* The underlay content (revealed later) */}
            <div className="absolute inset-0 bg-primary/20 z-10"></div>
            
            <div className="hero-reveal-content absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pt-16 opacity-0">
              <h2 className="text-5xl md:text-[6rem] lg:text-[8rem] font-bold uppercase tracking-[0.1em] mb-8 font-playfair text-white drop-shadow-2xl leading-tight">
                THE FOREST <br className="md:hidden" /> GATE
              </h2>
              <p className="max-w-xl mx-auto text-lg md:text-xl font-light tracking-wide mb-12 opacity-90 drop-shadow-md text-white px-4 leading-relaxed">
                Luxury meets nature in the heart of Himachal. Experience tranquility like never before in our sustainable Himalayan sanctuary.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/booking" className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-[#f9b115] hover:bg-[#e2a013] text-black font-bold text-lg hover:scale-105 transition-all active:scale-95 shadow-[0_10px_40px_-10px_rgba(249,177,21,0.5)]">
                  Book Your Stay
                </Link>
                <Link href="/rooms" className="inline-flex items-center justify-center h-16 px-12 rounded-full border-2 border-white/80 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all active:scale-95">
                  Explore Rooms
                </Link>
              </div>
            </div>
        </div>

        {/* Top Shutter (Structural Overlap Fix) */}
        <div className="split-layer-top absolute top-0 left-0 right-0 h-[50.5vh] z-30 bg-[#fffef8] overflow-hidden pointer-events-none">
          <SplitContent side="top" />
        </div>

        {/* Bottom Shutter (Structural Overlap Fix) */}
        <div className="split-layer-bottom absolute top-[49.5vh] left-0 right-0 h-[50.5vh] z-20 bg-[#fffef8] overflow-hidden pointer-events-none">
          <SplitContent side="bottom" />
        </div>

      </div>
    </section>
  );
}