
'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
        .to(".split-image", {
          scale: 1.3,
          duration: 5,
          ease: "power2.inOut"
        })
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

  return (
    <section ref={containerRef} className="relative bg-[#0b2c3d]">
      {/* Intro Wrapper (Pinned Section) */}
      <div ref={introWrapperRef} className="relative h-screen w-full overflow-hidden z-50">
        
        {/* REVEAL UNDERLAY (The target hero content) */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-4">
          <div className="absolute inset-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
              <source src="https://assets.mixkit.co/videos/preview/kit-drone-view-of-a-dense-forest-in-the-mountains-34531-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b2c3d] via-transparent to-[#0b2c3d]" />
          </div>
          
          <div className="hero-reveal-content relative z-10 max-w-4xl text-white opacity-0">
            <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] mb-6 font-headline">
              THE FOREST GATE
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide mb-10 opacity-90 drop-shadow-md">
              Luxury meets nature in the heart of Himachal. Experience tranquility like never before in our sustainable Himalayan sanctuary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/booking" className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-secondary text-black font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                Book Your Stay
              </Link>
              <Link href="/rooms" className="inline-flex items-center justify-center h-16 px-12 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all active:scale-95">
                Explore Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Top Layer */}
        <div className="split-layer-top absolute inset-0 z-20 bg-background overflow-hidden [clip-path:inset(0_0_50%_0)] pointer-events-none">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="split-inner-content w-full max-w-5xl px-4">
              <h1 className="text-6xl md:text-[10rem] font-bold font-headline uppercase leading-none text-slate-900 mb-8">
                WE CREATE
              </h1>
              <div className="text-container-top relative h-20 md:h-32 w-full">
                {highlights.map((h, i) => (
                  <p key={i} className="service-name absolute inset-0 opacity-0 text-3xl md:text-6xl font-black uppercase tracking-widest text-[#fcb101] flex items-center justify-center">
                    {h.title}
                  </p>
                ))}
              </div>
              <div className="relative w-[70vw] max-w-[980px] aspect-video mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="split-image absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://6000-firebase-studio-1770279522423.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev/assets/videos/pecockwalking.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Layer (Identical content, different clip) */}
        <div className="split-layer-bottom absolute inset-0 z-10 bg-background overflow-hidden [clip-path:inset(50%_0_0_0)] pointer-events-none">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="split-inner-content w-full max-w-5xl px-4">
              <h1 className="text-6xl md:text-[10rem] font-bold font-headline uppercase leading-none text-slate-900 mb-8">
                WE CREATE
              </h1>
              <div className="text-container-bottom relative h-20 md:h-32 w-full">
                {highlights.map((h, i) => (
                  <p key={i} className="service-name absolute inset-0 opacity-0 text-3xl md:text-6xl font-black uppercase tracking-widest text-[#fcb101] flex items-center justify-center">
                    {h.title}
                  </p>
                ))}
              </div>
              <div className="relative w-[70vw] max-w-[980px] aspect-video mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="split-image absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://6000-firebase-studio-1770279522423.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev/assets/videos/pecockwalking.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
