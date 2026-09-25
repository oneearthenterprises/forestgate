'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trees,
  Mountain,
  Flame,
  Moon,
  Sun,
  Coffee,
  Utensils,
  Wifi,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Heart,
  Users,
  Bed,
  Eye,
  Wind,
  Compass,
  Star,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Tv,
  Car,
  Phone,
  Feather,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MustExperienceSlider } from '@/components/shared/MustExperienceSlider';

export default function RetreatDetailClient({ retreat }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeExpTab, setActiveExpTab] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  const sectionLabelStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 'normal',
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 selection:bg-[#ffae3e]/30 selection:text-slate-950">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
        {/* Background Image with Parallax Style Scaling */}
        <div className="absolute inset-0 z-0">
          <Image
            src={retreat.coverImage}
            alt={`${retreat.name} at The Forest Gate Trails`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.68] scale-105"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b242e] via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white max-w-5xl">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 text-[#ffae3e]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffae3e]" />
            <span>The Forest Gate Trails • {retreat.badge}</span>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold font-headline tracking-tight leading-[1.1] mb-6 drop-"
          >
            {retreat.name}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-2xl text-slate-200/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow"
          >
            {retreat.tagline}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16"
          >
            <Button
              asChild
              className="h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-[#82c244] hover:bg-[#70a83a] text-white font-bold text-sm tracking-wider uppercase  transition-all duration-300 hover:scale-105 active:scale-95 border-none"
            >
              <Link href="/booking" className="flex items-center gap-3">
                Reserve Your Stay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105"
            >
              <a href="#experiences" className="flex items-center gap-2">
                Explore Experiences
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </a>
            </Button>
          </motion.div>

          {/* Key Stat Badges Grid */}
  
        </div>
      </section>

      {/* 2. THE STORY & OVERVIEW */}
      <section className="py-20 md:py-28 bg-[#faf8f5] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeInUp}>
              <p className="mb-2" style={sectionLabelStyle}>
                The Soul of Sanctuary
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-slate-900 tracking-tight leading-tight mb-6">
                Where Mountain Tranquility Meets Sustainable Luxury
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-light">
                {retreat.overview}
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                {retreat.summary} Perched at an elevation of {retreat.elevation} in Village Tandeo,
                Panchkula, guests enjoy cooler breezes, untamed pine scents, and starry night skies
                unmatched by crowded hill stations.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-[#085d6b]">{retreat.elevation}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                    Above Sea Level
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ffae3e]">Village Tandeo</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                    Morni Hills, Haryana
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Collage Visuals */}
            <motion.div {...fadeInUp} className="relative">
              <div className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden  border-4 border-white">
                <Image
                  src={retreat.gallery?.[0] || retreat.coverImage}
                  alt={`${retreat.name} grounds`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {retreat.gallery?.[1] && (
                <div className="hidden sm:block absolute -bottom-8 -left-8 w-56 h-56 rounded-2xl overflow-hidden  border-4 border-white">
                  <Image
                    src={retreat.gallery[1]}
                    alt={`${retreat.name} detail view`}
                    fill
                    sizes="250px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="absolute top-6 right-6 bg-[#085d6b] text-white px-4 py-2 rounded-xl  text-xs font-semibold uppercase tracking-wider">
                Pure Mountain Air
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE EXPERIENCES */}
      <section id="experiences" className="py-20 md:py-28 bg-[#0b242e] text-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-14">
            <p className="mb-2" style={sectionLabelStyle}>
              Curated Escapes
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline tracking-tight text-white mb-4">
              Signature {retreat.name} Experiences
            </h2>
            <p className="text-white/70 text-lg font-light leading-relaxed">
              Every hour is crafted to slow your breath, awaken your curiosity, and reconnect you
              with the earth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {retreat.experiences.map((exp, idx) => (
              <motion.div
                key={exp.id || idx}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#ffae3e]/60 transition-all duration-300 group hover:-translate-y-1.5 "
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#ffae3e] uppercase tracking-wider">
                      {exp.tag}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#ffae3e]" />
                        {exp.duration}
                      </span>
                      <span>•</span>
                      <span>{exp.timing}</span>
                    </div>

                    <h3 className="text-lg font-bold font-headline text-white mb-2 group-hover:text-[#ffae3e] transition-colors leading-snug">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="text-xs text-[#82c244] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Complimentary for Guests
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACCOMMODATIONS AT THIS RETREAT */}
      <section className="py-20 md:py-28 bg-[#faf8f5] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="mb-2" style={{ ...sectionLabelStyle, textAlign: 'center' }}>
              Bespoke Living
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-slate-900 tracking-tight mb-4">
              Villas & Suites at {retreat.name}
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Crafted from local stone and cedar timber, positioned for total privacy and breathtaking
              mountain vistas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {retreat.accommodations.map((villa, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200  flex flex-col justify-between group hover: transition-all duration-300"
              >
                <div>
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                    <Image
                      src={villa.image}
                      alt={villa.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow">
                      {villa.type}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3.5 py-1 rounded-xl text-xs font-semibold">
                      {villa.size}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-2xl font-bold font-headline text-slate-900">{villa.name}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#085d6b]">{villa.price}</span>
                        <span className="text-xs text-slate-500 block">/ per night</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6 leading-relaxed font-light">
                      {villa.desc}
                    </p>

                    <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                      <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                        Villa Highlights
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {villa.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-xs bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#82c244]" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <Button
                    asChild
                    className="w-full h-13 rounded-2xl bg-[#085d6b] hover:bg-[#064a56] text-white font-bold text-sm tracking-wider uppercase transition-all duration-300"
                  >
                    <Link href="/booking" className="flex items-center justify-center gap-2">
                      Book This Sanctuary
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RETREAT FEATURES & AMENITIES */}
      <section className="py-20 md:py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="mb-2" style={sectionLabelStyle}>
                The Experience
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-headline text-slate-900 tracking-tight mb-4">
                Exclusive Amenities at {retreat.name}
              </h2>
              <p className="text-slate-600 leading-relaxed font-light mb-6">
                From high-speed satellite internet to private open-sky dining, every modern amenity
                is balanced seamlessly with raw Himalayan seclusion.
              </p>
              <Button asChild className="rounded-full px-8 bg-[#ffae3e] hover:bg-[#e89c31] text-black font-bold">
                <Link href="/amenities">View All Resort Amenities</Link>
              </Button>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {retreat.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#faf8f5] border border-slate-200 flex items-start gap-3.5 hover:border-[#085d6b] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#085d6b]/10 text-[#085d6b] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 leading-snug">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS SPECIFIC TO THIS RETREAT */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="mb-2" style={{ ...sectionLabelStyle, textAlign: 'center' }}>
              Curious Minds
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-headline text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {retreat.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 hover:text-[#085d6b] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 text-slate-400 ${
                      openFaq === idx ? 'rotate-180 text-[#085d6b]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MUST-DO EXPERIENCES & SANCTUARIES SLIDER */}
      <MustExperienceSlider
        title="Must-do experiences"
        description="These essential Forest Gate sanctuaries and experiences belong on every visitor's list. Don't leave without ticking off these unforgettable moments."
        wide={true}
        className="bg-[#faf8f5] border-t border-slate-200"
      />

      {/* 8. RESERVATION CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-br from-[#085d6b] via-[#094c57] to-[#04282f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,174,62,0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <Badge className="bg-[#ffae3e] text-black font-bold uppercase tracking-wider mb-4 px-4 py-1">
            Exclusive Wilderness Getaway
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tight mb-6">
            Ready to Experience {retreat.name}?
          </h2>
          <p className="text-lg text-white/80 font-light mb-10 leading-relaxed">
            Reserve your private villa now or speak with our mountain concierge for bespoke
            itineraries, group retreats, and special celebrations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="h-14 px-10 rounded-full bg-[#ffae3e] hover:bg-[#f29f27] text-black font-bold text-sm tracking-wider uppercase  transition-all hover:scale-105"
            >
              <Link href="/booking">Book Your Dates Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold text-sm tracking-wider uppercase transition-all hover:scale-105"
            >
              <Link href="/contact">Inquire with Concierge</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
