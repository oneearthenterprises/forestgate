'use client';

import { useState, useEffect } from 'react';
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

// --- DATA DEFINITIONS ---

const RETREAT_HIGHLIGHTS = [
  {
    icon: Mountain,
    label: '4,200 Ft. Elevation',
    sub: 'Crisp Shivalik mountain breeze',
  },
  {
    icon: Trees,
    label: 'Virgin Pine Canopy',
    sub: 'Surrounded by tranquil Morni forests',
  },
  {
    icon: Flame,
    label: 'Private Firepits',
    sub: 'Under a billion starlit sky',
  },
  {
    icon: Moon,
    label: 'Dark-Sky Stargazing',
    sub: 'Zero light pollution zone',
  },
];

const SIGNATURE_EXPERIENCES = [
  {
    id: 'forest-bathing',
    title: 'Forest Bathing & Mindful Trails',
    tag: 'Wellness',
    description:
      'Immerse your senses in guided Shinrin-yoku walks along pine-scented forest paths, discovering hidden mountain flora and ancient stone trails.',
    image: '/assets/images/forestgate-image/mountain%20trekking.jpg',
    duration: '2 Hours',
    timing: 'Morning & Sunset',
  },
  {
    id: 'open-sky-cinema',
    title: 'Starlight Forest Cinema',
    tag: 'Entertainment',
    description:
      'Cozy movie screenings surrounded by pine silhouettes with warm throws, freshly roasted s’mores, and handcrafted hot cocoa.',
    image: '/assets/images/forestgate-image/Mini-Cinema-Home-Theater.png',
    duration: 'Evening Session',
    timing: '8:00 PM Onwards',
  },
  {
    id: 'river-picnic',
    title: 'Crystal Riverbed Picnics',
    tag: 'Signature',
    description:
      'Follow private descending trails to clear mountain streams with curated chef baskets, artisanal cheeses, and chilled hill-fruit juices.',
    image: '/assets/images/forestgate-image/RIVER%20VIEW.jpeg',
    duration: 'Half Day',
    timing: 'Midday Leisure',
  },
  {
    id: 'bonfire-music',
    title: 'Campfire & Acoustic Nights',
    tag: 'Evening Ritual',
    description:
      'Gather around fragrant deodar wood fires for live acoustic strings, crackling embers, mountain barbecue skewers, and storytelling.',
    image: '/assets/images/forestgate-image/Bonfire.jpg',
    duration: '3 Hours',
    timing: '7:30 PM Onwards',
  },
  {
    id: 'birding-haven',
    title: 'Avian Watch & Photography',
    tag: 'Nature',
    description:
      'Over 110 resident and migratory bird species populate our canopy. Join our naturalist with high-powered scopes at dawn.',
    image: '/assets/images/forestgate-image/BIRD%20WATCHING.png',
    duration: '1.5 Hours',
    timing: 'Dawn at 6:30 AM',
  },
  {
    id: 'alfresco-dining',
    title: 'Canopy-Edge Dining',
    tag: 'Gastronomy',
    description:
      'Farm-to-table culinary experiences celebrating slow-cooked regional delicacies, fresh orchard herbs, and panoramic valley views.',
    image: '/assets/images/forestgate-image/Open%20Sky%20Dining.png',
    duration: 'Bespoke',
    timing: 'Breakfast & Dinner',
  },
];



const DAILY_RHYTHM = [
  {
    time: '06:30 AM',
    title: 'The Forest Awakening',
    desc: 'Golden sunrise rays pierce the pine mist. Sip hot ginger-tulsi tea on your private deck to a chorus of Himalayan songbirds.',
    icon: Sun,
  },
  {
    time: '09:00 AM',
    title: 'Orchard-Fresh Breakfast',
    desc: 'Artisanal sourdough, local honeycomb, farm-fresh eggs, and cold-pressed juices served alfresco with sweeping valley vistas.',
    icon: Coffee,
  },
  {
    time: '01:30 PM',
    title: 'Creek Walk & Riverside Picnic',
    desc: 'Follow our resident naturalist through untouched trails to secluded water pools for a gourmet hamper lunch under mountain willows.',
    icon: Compass,
  },
  {
    time: '05:30 PM',
    title: 'Golden Hour Mountain Chai',
    desc: 'Watch the Shivalik ridges blush rose and gold with freshly baked mountain cookies, local pakoras, and fragrant Darjeeling tea.',
    icon: Mountain,
  },
  {
    time: '08:00 PM',
    title: 'Stargazing, Fires & Feast',
    desc: 'Embers flicker in your private pit as the cosmos unfurls overhead. Relish live clay-oven grills and fine wine by the warmth of the fire.',
    icon: Flame,
  },
];

const RETREAT_AMENITIES = [
  { icon: Wifi, title: 'High-Speed Mountain Wi-Fi', desc: 'Stay connected for workcation retreats' },
  { icon: Users, title: 'Dedicated Retreat Host', desc: 'Bespoke concierge for every stay' },
  { icon: Heart, title: 'Pet-Friendly Sanctuaries', desc: 'Expansive private lawns for furry family' },
  { icon: Moon, title: 'Telescope Stargazing', desc: 'High-power astronomy optics available' },
  { icon: Utensils, title: 'In-Villa Dining', desc: 'Private chef barbecue & customized menus' },
  { icon: Wind, title: 'Yoga & Meditation Decks', desc: 'Equipped with mats and valley-facing platforms' },
  { icon: Car, title: 'Valet & Private Parking', desc: 'Secure covered parking with EV charging' },
  { icon: ShieldCheck, title: 'Secure & Gated Estate', desc: '24/7 on-ground security & surveillance' },
];

const DISTANCES = [
  { city: 'Chandigarh', km: '45 km', time: '~1 hr 15 min', note: 'Scenic Himalayan expressway & hill climb' },
  { city: 'Panchkula', km: '38 km', time: '~1 hr', note: 'Smooth mountain twisties past Morni Lake' },
  { city: 'Chandigarh Airport (IXC)', km: '52 km', time: '~1 hr 30 min', note: 'Airport pickup & luxury cab available' },
  { city: 'Delhi NCR', km: '260 km', time: '~4 hr 30 min', note: 'Fast NH44 drive to Panchkula bypass' },
];

const FAQS = [
  {
    q: 'What makes Wildwood Retreat different from regular resort stays?',
    a: 'Wildwood Retreat is our ultra-exclusive, low-density wilderness enclave at The Forest Gate. It offers total privacy, private firepits, dedicated personal hosts, custom nature trails, and unobstructed mountain vistas, perfect for travelers seeking tranquility away from crowded tourist hubs.',
  },
  {
    q: 'How do we reach Wildwood Retreat at The Forest Gate?',
    a: 'We are situated in Village Tandeo, Morni Hills, Panchkula, Haryana. The route from Chandigarh or Panchkula is smooth, fully paved, and extremely scenic. Private chauffeur and airport transfer services can be arranged upon request.',
  },
  {
    q: 'Are pets welcome at Wildwood Retreat?',
    a: 'Absolutely! We love pets and understand they are part of your family. Our cottages feature private lawns and wide forest trails where your pets can run freely and safely.',
  },
  {
    q: 'What is the climate like at Wildwood Retreat?',
    a: 'Perched over 4,000 feet above sea level, Wildwood enjoys refreshingly cooler temperatures than the surrounding plains year-round. Summer evenings are pleasant and breezy, monsoon brings lush waterfalls and sea-of-clouds mist, and winters are comfortably chilly with crisp blue skies and cozy firepit weather.',
  },
  {
    q: 'Can we book Wildwood Retreat for private celebrations or corporate offsites?',
    a: 'Yes, the retreat can be booked on an exclusive buyout basis for intimate weddings, wellness retreats, anniversary getaways, or executive leadership offsites. Contact our concierge to customize your itinerary.',
  },
];

export default function WildwoodClient() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
        const data = await res.json();
        if (data && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };


  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  return (
    <div className="bg-[#fcfcfc] text-slate-800 overflow-x-hidden selection:bg-[#085d6b] selection:text-white">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image with Parallax-feel Zoom */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png"
            alt="Wildwood Retreat at The Forest Gate"
            fill
            priority
            className="object-cover object-center opacity-70 scale-105 transition-transform duration-[10s] hover:scale-110"
          />
          {/* Subtle multi-layer gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-950" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 text-center max-w-5xl">
        

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-kaushan text-[#ffae3e] text-3xl sm:text-4xl md:text-5xl mb-3 drop-shadow"
          >
            A Secret Eden in the Pines
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-headline text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.05] mb-6 drop-"
          >
            Wildwood <span className="text-[#ffae3e] italic font-serif">Retreat</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-2xl text-slate-200/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow"
          >
            Where luxury merges with untamed nature. Secluded timber villas, crackling
            starlight bonfires, private stream trails, and pure tranquility high in Haryana’s Morni Hills.
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
              className="h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-[#085d6b] hover:bg-[#074f5b] text-white font-bold text-sm tracking-wider uppercase  transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            >
              <Link href="/booking" className="flex items-center gap-3">
                Reserve Your Retreat
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

      {/* 2. THE PHILOSOPHY / THE STORY OF WILDWOOD */}
      <section className="py-20 sm:py-32 relative bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Story Column */}
            <motion.div {...fadeInUp} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#085d6b]/10 text-[#085d6b] text-[11px] font-black uppercase tracking-[0.2em]">
                <Feather className="w-3.5 h-3.5" />
                The Sanctuary Concept
              </div>

              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Crafted for Discerning Souls Seeking Quiet Splendor
              </h2>

              <p className="text-slate-600 text-lg sm:text-xl font-light leading-relaxed">
                Tucked gently into the pine-clad ridges of Morni Hills,{' '}
                <strong className="font-semibold text-slate-900">Wildwood Retreat</strong> is born
                from a singular desire: to build a retreat where comfort does not encroach upon
                wilderness, but honors it.
              </p>

              <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
                Here, mornings smell of cedar and mountain dew. Days move at the rhythm of the
                wind through branches, and nights bring deep stillness lit only by glowing embers and
                the brilliance of the Milky Way.
              </p>

              {/* Quote callout box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#085d6b]/5 border-l-4 border-[#085d6b] relative">
                <p className="font-headline text-lg sm:text-xl italic text-slate-800 leading-snug mb-3">
                  “We did not want to tame the mountain. We wanted to build a sanctuary where you
                  could listen to it.”
                </p>
                <div className="text-xs font-bold uppercase tracking-wider text-[#085d6b]">
                  — The Forest Gate Founder Philosophy
                </div>
              </div>

              {/* Quick Perks Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Low-density private acreage',
                  'Zero light & noise pollution',
                  'Organic farm-fresh produce',
                  '100% pet-friendly grounds',
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#085d6b] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual Collage Column */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden  border-4 border-white">
                <Image
                  src="/assets/images/forestgate-image/PROPERTTY.png"
                  alt="Wildwood Retreat Grounds"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlapping Floating Photo Card */}
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-64 aspect-[4/3] rounded-3xl overflow-hidden  border-4 border-white">
                <Image
                  src="/assets/images/forestgate-image/Bonfire.jpg"
                  alt="Evening Bonfire at Wildwood"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5  border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffae3e]/20 text-[#085d6b] flex items-center justify-center font-black text-xl">
                  ★ 4.9
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm">Guest Rating</div>
                  <div className="text-xs text-slate-500 font-light">Over 1,200+ peaceful stays</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE RETREAT EXPERIENCES (NEW FEATURED SECTION) */}
      <section id="experiences" className="py-24 sm:py-32 bg-[#f4f7f6] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <p className="font-kaushan text-[#ffae3e] text-2xl sm:text-3xl mb-2">
              Immersive Wilderness
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Curated Wildwood Experiences
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-light">
              Every hour at Wildwood is crafted to slow your breath, awaken your curiosity, and
              immerse you in the tranquil power of the forest.
            </p>
          </motion.div>

          {/* Experience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIGNATURE_EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden  hover: transition-all duration-500 hover:-translate-y-2 border border-slate-100 flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#085d6b] text-white border-none rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow">
                      {exp.tag}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#ffae3e]" />
                    {exp.duration}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#085d6b] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium flex items-center gap-1.5 text-slate-700">
                      <Sun className="w-3.5 h-3.5 text-[#ffae3e]" />
                      {exp.timing}
                    </span>
                    <Link
                      href="/experiences"
                      className="font-bold text-[#085d6b] hover:text-[#06434d] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACCOMMODATIONS AT WILDWOOD (COTTAGES & SUITES) */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <p className="font-kaushan text-[#ffae3e] text-2xl sm:text-3xl mb-2">
                Private Luxury Lodgings
              </p>
              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                Villas & Suites at Wildwood
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 h-12 border-slate-300 hover:bg-[#085d6b] hover:text-white transition-all self-start md:self-auto"
            >
              <Link href="/rooms">View All Resort Rooms</Link>
            </Button>
          </motion.div>

          {/* Villa Cards */}
          {roomsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/80 animate-pulse flex flex-col">
                  <div className="aspect-[16/11] bg-slate-200" />
                  <div className="p-8 space-y-4 flex-1">
                    <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-7 bg-slate-200 rounded-xl w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                    <div className="h-4 bg-slate-100 rounded-full w-5/6" />
                    <div className="h-px bg-slate-200 my-4" />
                    <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                    <div className="flex justify-between items-center mt-6">
                      <div className="h-8 bg-slate-200 rounded-full w-28" />
                      <div className="h-10 bg-slate-200 rounded-full w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-lg font-light">
              No rooms available right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {rooms.map((room, idx) => (
                <motion.div
                  key={room._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200/80 transition-all duration-500 hover:-translate-y-2 flex flex-col group"
                >
                  {/* Room Image */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-slate-900">
                    <Image
                      src={room.images?.[0] || room.image || '/assets/images/forestgate-image/PROPERTTY.png'}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {(room.category || room.badge) && (
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900">
                          {room.category || room.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline text-2xl sm:text-3xl font-black text-slate-900 mb-2 group-hover:text-[#085d6b] transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                        {room.description}
                      </p>

                      {/* Room Meta Specs */}
                      <div className="grid grid-cols-2 gap-3 py-4 border-y border-dashed border-slate-200 mb-6 text-xs text-slate-700 font-medium">
                        {(room.capacity || room.maxGuests) && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#085d6b]" />
                            <span>{room.capacity ? `${room.capacity} Guests` : `${room.maxGuests} Guests`}</span>
                          </div>
                        )}
                        {(room.bedType || room.bed) && (
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-[#085d6b]" />
                            <span>{room.bedType || room.bed}</span>
                          </div>
                        )}
                        {(room.view || room.location) && (
                          <div className="flex items-center gap-2 col-span-2">
                            <Eye className="w-4 h-4 text-[#085d6b]" />
                            <span>{room.view || room.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Amenities Checklist */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="space-y-2 mb-8">
                          {room.amenities.slice(0, 6).map((amenity, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#ffae3e]" />
                              <span>{typeof amenity === 'object' ? (amenity.name || amenity.label || amenity.title) : amenity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing and Book Button */}
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          Starting From
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-[#085d6b]">
                          ₹{(room.price || room.pricePerNight || 0).toLocaleString()}
                          <span className="text-xs font-normal text-slate-500"> / night</span>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="rounded-full px-6 h-12 bg-[#085d6b] hover:bg-[#06434d] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all"
                      >
                        <Link href="/booking">Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. A DAY AT WILDWOOD (CURATED TIMELINE ITINERARY - NEW SECTION) */}
      <section className="py-24 sm:py-32 bg-[#085d6b] text-white relative overflow-hidden">
        {/* Decorative blur rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffae3e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <p className="font-kaushan text-[#ffae3e] text-2xl sm:text-3xl mb-2">
              The Art of Slow Living
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
              A Day at Wildwood Retreat
            </h2>
            <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed">
              Unplug from notifications and rediscover the forgotten rhythm of sunlight, mountain
              breeze, and twilight embers.
            </p>
          </motion.div>

          {/* Timeline Steps */}
          <div className="space-y-6 sm:space-y-8">
            {DAILY_RHYTHM.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-white/15 transition-all duration-300"
                >
                  {/* Time Badge */}
                  <div className="shrink-0 flex items-center sm:flex-col gap-3 sm:gap-1 text-left sm:text-center w-full sm:w-36 pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-white/20 sm:pr-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffae3e]/20 text-[#ffae3e] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-black text-xl sm:text-2xl text-[#ffae3e] tracking-tight">
                      {step.time}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="flex-1">
                    <h3 className="font-headline text-2xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/85 text-sm sm:text-base font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BESPOKE RETREAT AMENITIES (NEW SECTION) */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
            <p className="font-kaushan text-[#ffae3e] text-2xl sm:text-3xl mb-2">
              Thoughtful Touches
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Bespoke Retreat Amenities
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-light">
              Combining the untamed beauty of high-altitude forests with all the modern comforts
              you love.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RETREAT_AMENITIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-8 rounded-3xl bg-slate-50/80 hover:bg-[#085d6b]/5 border border-slate-100 transition-all duration-300 hover: hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-[#085d6b] group-hover:bg-[#085d6b] group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. GETTING HERE / DISTANCE GUIDE (NEW SECTION) */}
      <section className="py-20 sm:py-28 bg-[#f4f7f6] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#085d6b]/10 text-[#085d6b] text-[11px] font-black uppercase tracking-[0.2em] mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Easy Mountain Access
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              How to Reach Wildwood Retreat
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-light">
              Nestled in Village Tandeo, Morni Hills, Panchkula, Haryana. Effortlessly accessible via
              smooth highways and scenic hill roads.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DISTANCES.map((dist, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover: transition-all"
              >
                <div className="text-xs font-black uppercase tracking-wider text-[#085d6b] mb-1">
                  From
                </div>
                <h3 className="font-headline text-2xl font-bold text-slate-900 mb-2">
                  {dist.city}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-black text-[#ffae3e]">{dist.km}</span>
                  <span className="text-xs font-medium text-slate-500">({dist.time})</span>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed pt-3 border-t border-slate-100">
                  {dist.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQS ACCORDION (NEW SECTION) */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <p className="font-kaushan text-[#ffae3e] text-2xl sm:text-3xl mb-2">
              Everything You Need to Know
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left font-headline text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-between gap-4 hover:text-[#085d6b] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#085d6b]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-slate-600 text-base font-light leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MUST-DO SANCTUARIES & EXPERIENCES SLIDER */}
      <MustExperienceSlider
        title="Must-do experiences"
        description="These essential Forest Gate sanctuaries and experiences belong on every visitor's list. Don't leave without ticking off these unforgettable moments."
        wide={true}
        className="bg-white border-t border-slate-200"
      />

      {/* 9. HIGH-CONVERSION CINEMATIC CALL TO ACTION */}
      <section className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/assets/images/forestgate-image/FORNT%20VIEW%20PROPERTY.png"
            alt="The Forest Gate Property"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center">
          <motion.div {...fadeInUp} className="space-y-8">
          

            <h2 className="font-headline text-4xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tight">
              Ready to Escape to <br className="hidden sm:inline" />
              <span className="text-[#ffae3e] italic font-serif">Wildwood Retreat?</span>
            </h2>

            <p className="text-slate-300 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Book your private cottage or villa today. Special bespoke packages available for couples,
              families, and corporate nature offsites.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
              <Button
                asChild
                className="h-16 px-10 rounded-full bg-[#ffae3e] hover:bg-[#f09e2b] text-slate-950 font-black text-sm uppercase tracking-widest  transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Link href="/booking" className="flex items-center gap-3">
                  Check Availability & Book
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-16 px-10 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#ffae3e]" />
                  Talk with Retreat Concierge
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
