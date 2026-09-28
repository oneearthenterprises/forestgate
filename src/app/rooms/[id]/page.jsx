'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Share2,
  Heart,
  Star,
  MapPin,
  User,
  Wind,
  Clock,
  Waves,
  Coffee,
  Wifi,
  Tv,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Bed,
  Bath,
  Mountain,
  HelpCircle,
} from 'lucide-react';
import { API } from '@/lib/api/api';

const DEFAULT_RESORT_PHOTOS = [
  '/assets/images/forestgate-image/YOUR SANCTUARY IN THE MOPUNTAINS.png',
  '/assets/images/forestgate-image/ROOM 1.jpeg',
  '/assets/images/forestgate-image/MOUNTAIN.png',
  '/assets/images/forestgate-image/BATHROOM.jpeg',
  '/assets/images/forestgate-image/POOLSIDE SUNSET PARTY.jpg',
  '/assets/images/forestgate-image/Open Sky Dining.png',
];

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  useEffect(() => {
    const getRoom = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API.getRoomById(params.id));
        const data = await response.json();
        setRoom(data.room);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getAllRooms = async () => {
      try {
        const response = await fetch(API.GetAllRooms);
        const data = await response.json();
        setAllRooms(data.rooms || []);
      } catch (error) {
        console.error('Error fetching all rooms:', error);
      }
    };

    if (params?.id) {
      getRoom();
      getAllRooms();
    }
  }, [params]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2500);
    }
  };

  if (isLoading || !room) {
    return (
      <div className="bg-[#fcfdfd] min-h-screen pt-[100px] py-10">
        <div className="container mx-auto px-4 max-w-6xl animate-pulse space-y-8">
          <div className="h-6 w-72 bg-slate-200 rounded-lg" />
          <div className="h-12 w-96 bg-slate-200 rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-4 h-[420px]">
            <div className="bg-slate-200 rounded-3xl h-full" />
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="col-span-2 bg-slate-200 rounded-3xl h-[200px]" />
              <div className="bg-slate-200 rounded-3xl h-[200px]" />
              <div className="bg-slate-200 rounded-3xl h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build the 4-photo grid array gracefully
  const roomImages = (room.images && room.images.length > 0)
    ? room.images.map(img => img.url)
    : [];

  const mosaicPhotos = [
    roomImages[0] || DEFAULT_RESORT_PHOTOS[0],
    roomImages[1] || DEFAULT_RESORT_PHOTOS[1],
    roomImages[2] || DEFAULT_RESORT_PHOTOS[2],
    roomImages[3] || DEFAULT_RESORT_PHOTOS[3],
  ];

  // Facilities mapping
  const facilities = [
    { icon: Wind, label: 'Air conditioner', desc: 'Climate controlled cooling & heating' },
    { icon: Clock, label: 'Receptionist 24h', desc: 'Dedicated round-the-clock concierge' },
    { icon: Waves, label: 'Swimming pool', desc: 'Open-sky mountain view pool access' },
    { icon: Coffee, label: 'Lounge bar & cafe', desc: 'Farm-to-fork dining and room service' },
    { icon: Wifi, label: 'High-Speed Free Wi-Fi', desc: 'Seamless high-speed connectivity' },
    { icon: Bed, label: 'Plush King Bedding', desc: 'Custom posturepedic mountain mattress' },
    { icon: Bath, label: 'Private En-Suite Bathroom', desc: 'Premium toiletries & rainfall shower' },
    { icon: Mountain, label: 'Scenic Nature Outlook', desc: 'Uninterrupted valley & forest views' },
  ];

  const visibleFacilities = showAllFacilities ? facilities : facilities.slice(0, 4);

  const fullText = room.fullDescription || room.shortDescription || 
    'Overlooking the serene greenery of the surrounding mountains, The Forest Gate is located in Village Tandeo, Morni Hills, Panchkula. This tranquil luxury retreat offers an outdoor pool, curated nature trails, gourmet open-sky dining, and bonfires. The accommodation operates a 24-hour front desk that can arrange express check-in and check-out, room service, and guided trekking safaris for guests.';

  const isTextLong = fullText.length > 220;
  const displayText = (!showFullDesc && isTextLong) ? `${fullText.slice(0, 220)}...` : fullText;

  return (
    <div className="bg-[#fcfdfd] min-h-screen text-slate-800 pt-[95px] pb-28 lg:pb-16 font-sans">
      {/* Copy notification popup */}
      <AnimatePresence>
        {copyNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4  pt-6 md:pt-10">
        {/* 1. Header with Breadcrumb & Action Buttons */}
        <div className="mb-6">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
            <Link href="/" className="hover:text-slate-700 transition-colors">Hotel</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-slate-700 transition-colors">Morni Hills</Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{room.roomName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-slate-900 tracking-tight">
                {room.roomName}
              </h1>

              {/* Badges / Rating / Location Line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">• 100+ reviews</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Village Tandeo, Morni Hills
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <User className="w-3.5 h-3.5 text-primary" />
                  The Forest Gate
                </span>
              </div>
            </div>

            {/* Share and Save Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all hover:scale-105"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all hover:scale-105 ${
                  isSaved ? 'text-rose-500 border-rose-200' : 'text-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Photo Gallery Mosaic Grid */}
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-2 gap-4 mb-8 h-[460px]">
          {/* Main Hero Photo (Left) */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 group">
            <Image
              src={mosaicPhotos[0]}
              alt={room.roomName}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                {room.tag || 'Luxury Sanctuary'}
              </span>
            </div>
          </div>

          {/* Right 3-Photo Subgrid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Top Wide Photo */}
            <div className="col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 group h-[222px]">
              <Image
                src={mosaicPhotos[1]}
                alt="Room detail"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Bottom Left Photo */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 group h-[222px]">
              <Image
                src={mosaicPhotos[2]}
                alt="Room amenity"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Bottom Right Photo */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 group h-[222px]">
              <Image
                src={mosaicPhotos[3]}
                alt="Resort surroundings"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Mobile Gallery Layout */}
        <div className="md:hidden mb-6 space-y-3">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900">
            <Image
              src={mosaicPhotos[0]}
              alt={room.roomName}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {mosaicPhotos.slice(1, 4).map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src={photo}
                  alt={`Gallery thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>


    

        {/* 4. Main Two-Column Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Overview / Description */}
            <div id="overview" className="space-y-3"> 
              <h2 className="text-2xl font-bold font-headline text-slate-900 tracking-tight">
                Comfortable place for you
              </h2>
              <p className="text-slate-600 text-sm md:text-base font-light leading-relaxed">
                {displayText}
                {isTextLong && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="ml-2 font-semibold text-primary hover:underline inline-flex items-center"
                  >
                    {showFullDesc ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </p>
            </div>

            <Separator className="bg-slate-200/70" />

            {/* Best Facilities List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-headline text-slate-900 tracking-tight">
                  Our best facilities
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  {facilities.length} In-Room Amenities
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {visibleFacilities.map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-xs"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100/90 text-slate-700 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-slate-800" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{fac.label}</p>
                        <p className="text-xs text-slate-400 font-light truncate">{fac.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAllFacilities(!showAllFacilities)}
                className="text-xs font-bold text-[#207555] hover:text-[#175b42] flex items-center gap-1.5 transition-colors pt-1"
              >
                <span>{showAllFacilities ? 'Show fewer facilities' : 'See more facilities'}</span>
                {showAllFacilities ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <Separator className="bg-slate-200/70" />

            {/* What's Included div */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-headline text-slate-900 tracking-tight">
                What&apos;s included in your stay
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Complimentary high-speed Wi-Fi access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Morning mountain trek with guided path</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Swimming pool with mountain view access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>24/7 dedicated room service & reception</span>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-200/70" />

            {/* Room Rules & Policies */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-headline text-slate-900 tracking-tight">
                Sanctuary Policies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-In</p>
                  <p className="text-sm font-bold text-slate-800">12:00 PM</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-Out</p>
                  <p className="text-sm font-bold text-slate-800">11:00 AM</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Max Adults</p>
                  <p className="text-sm font-bold text-slate-800">{room.maxAdults || 2} Guests</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Extra Bed</p>
                  <p className="text-sm font-bold text-slate-800">₹{room.extraBeddingPrice || 1000}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Review & Booking Card) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/80 p-7 sm:p-8 space-y-6">
                {/* Rating Card Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Reviews and ratings
                    </h3>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] font-bold">
                      Verified Sanctuary
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-slate-900 font-headline">4.8</span>
                    <div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 font-light mt-0.5">Based on 100 reviewers</p>
                    </div>
                  </div>

                  {/* Rating Progress Bars */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Comfortable</span>
                        <span>4.7</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#207555] h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Cleanliness</span>
                        <span>4.8</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#207555] h-full rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>Facilities</span>
                        <span>4.5</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#207555] h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Pricing Block */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Start from</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 font-headline">
                        ₹{room.pricePerNight?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/Night/Room</span>
                    </div>
                  </div>
                </div>

                {/* Primary Booking Button */}
                <Button
                  asChild
                  size="lg"
                  className="w-full h-14 rounded-full bg-[#207555] hover:bg-[#185e44] text-white font-bold text-sm tracking-wide shadow-md shadow-[#207555]/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                >
                  <Link href={`/booking?roomId=${room._id}`} className="flex items-center justify-center gap-2">
                    <span>Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                {/* WhatsApp Concierge Support */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-11 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  <a
                    href={`https://wa.me/917009984070?text=Hi%2C%20I%20am%20interested%20in%20booking%20${encodeURIComponent(room.roomName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-primary" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Instant confirmation • No reservation fee required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Mobile Fixed Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-6 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Start from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-headline">
              ₹{room.pricePerNight?.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">/Night/Room</span>
          </div>
        </div>

        <Button
          asChild
          className="rounded-full bg-[#207555] hover:bg-[#185e44] text-white font-bold px-8 h-12 text-sm shadow-md"
        >
          <Link href={`/booking?roomId=${room._id}`}>
            Booking
          </Link>
        </Button>
      </div>

      {/* 6. Similar Accommodations Carousel */}
      {allRooms.filter((r) => r._id !== room._id).length > 0 && (
        <div className="py-8 md:py-8 mt-16 bg-slate-50/60 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="font-kaushan text-[#ffae3e] text-2xl mb-1">Discover More</p>
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-slate-900 tracking-tight">
                  Other Forest Gate Accommodations
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-full px-6 border-slate-200 hover:bg-white text-xs font-semibold">
                <Link href="/rooms" className="flex items-center gap-1.5">
                  <span>View All Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allRooms
                .filter((r) => r._id !== room._id)
                .slice(0, 3)
                .map((simRoom) => (
                  <Link
                    key={simRoom._id}
                    href={`/rooms/${simRoom._id}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <Image
                        src={simRoom.images?.[0]?.url || DEFAULT_RESORT_PHOTOS[0]}
                        alt={simRoom.roomName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {simRoom.tag || 'Sanctuary'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-headline text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                          {simRoom.roomName}
                        </h4>
                        <p className="text-slate-500 text-xs line-clamp-2 font-light">
                          {simRoom.shortDescription || 'Experience luxury and nature at The Forest Gate.'}
                        </p>
                      </div>
                      <div className="flex items-baseline justify-between pt-4 border-t border-slate-100 mt-4">
                        <span className="text-lg font-black text-slate-900 font-headline">
                          ₹{simRoom.pricePerNight?.toLocaleString()}
                          <span className="text-xs font-normal text-slate-400"> / night</span>
                        </span>
                        <span className="text-xs font-bold text-[#207555] group-hover:underline flex items-center gap-1">
                          Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}