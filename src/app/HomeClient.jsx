'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  faqs,
  galleryImages,
  highlights,
  amenities,
} from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Testimonials } from '@/components/shared/Testimonials';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Flame, Heart, Star, ArrowRight } from 'lucide-react';
import { AmenityCard } from '@/components/shared/AmenityCard';
import { ExperiencesCarousel } from '@/components/shared/ExperiencesCarousel';
import { HeroScroll } from '@/components/shared/HeroScroll';
import { InteractiveMapSection } from '@/components/shared/InteractiveMapSection';
import { ManagedBySection } from '@/components/shared/ManagedBySection';
import { WildlifeCarousel } from '@/components/shared/WildlifeCarousel';
import { InfluencersCarousel } from '@/components/shared/InfluencersCarousel';
import { HighlightsCarouselWrapper } from '@/components/shared/HighlightsCarouselWrapper';
import { MobileRoomsCarouselWrapper } from '@/components/shared/MobileRoomsCarouselWrapper';
import { WelcomePopup } from '@/components/shared/WelcomePopup';
import { BoutiqueTypography } from '@/components/shared/BoutiqueTypography';
import { AtmosphereCarousel } from '@/components/shared/AtmosphereCarousel';
import { API } from '@/lib/api/api';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  
  const seeMoreImages = galleryImages
    .slice(0, 4)
    .map((img) => PlaceHolderImages.find((p) => p.id === img.id))
    .filter(Boolean);

  const highlightsWithImages = highlights.map(highlight => {
    let imageId = '';
    switch (highlight.title) {
      case 'Mountain View':
        imageId = 'about-resort';
        break;
      case 'River View':
        imageId = 'hero-1';
        break;
      case 'Adventure Activities':
        imageId = 'exp-sports';
        break;
      case 'Family & Pet Friendly':
        imageId = 'exp-pet-friendly';
        break;
      case 'Stargazing':
        imageId = 'exp-stargazing';
        break;
    }
    const image = PlaceHolderImages.find(img => img.id === imageId);
    return { ...highlight, image };
  }).filter(h => !!h.image);

  const sectionLabelStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: '400',
    textAlign: 'left',
    lineHeight: 'normal',
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const RoomsSkeleton = () => (
    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
      {/* Large Card Skeleton */}
      <div className="bg-slate-100 rounded-2xl aspect-[4/5] w-full" />
      
      {/* 2x2 Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-100 rounded-2xl aspect-square w-full" />
        <div className="bg-slate-100 rounded-2xl aspect-square w-full" />
        <div className="bg-slate-100 rounded-2xl aspect-square w-full" />
        <div className="bg-slate-100 rounded-2xl aspect-square w-full" />
      </div>
    </div>
  );

  const MobileRoomsSkeleton = () => (
    <div className="lg:hidden animate-pulse">
        <div className="bg-slate-100 rounded-2xl aspect-[4/5] w-full" />
    </div>
  );

  useEffect(() => {
    const getRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API.GetAllRooms, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const getRoomsData = await response.json();
        setRooms(getRoomsData.rooms);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getRooms();
  }, []);

  return (
    <div className="relative">
      <WelcomePopup />
      <HeroScroll />

      <motion.section 
        {...fadeInUp}
        id="highlights" 
        className="py-[10px] px-4 md:px-[81px]" 
      >
        <div className="container mx-auto px-0">
          <HighlightsCarouselWrapper highlightsWithImages={highlightsWithImages} />
        </div>
      </motion.section>

      <motion.section {...fadeInUp} id="about-preview">
        <div className="container mx-auto px-4 eeeeee">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="mb-2" style={sectionLabelStyle}>About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
                Your Sanctuary in the Mountains
              </h2>
              <p className="mb-4 text-lg text-foreground/80">
                Nestled away from the bustle, The Forest Gate is a testament to
                sustainable luxury. Our eco-friendly resort offers a serene,
                pollution-free environment, making it an ideal escape for
                couples, families, and corporate gatherings seeking peace and
                rejuvenation.
              </p>
              <Button asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-2xl group">
              <Image
                src="/assets/images/forestgate-image/RIVER VIEW.jpeg"
                alt="Deep forest sanctuary path"
                width={600}
                height={600}
                className="rounded-lg h-[500px] shadow-lg transition-transform duration-700 group-hover:scale-105 object-cover aspect-video"
                data-ai-hint="deep forest"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} id="rooms" className="bg-card">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-left" style={sectionLabelStyle}>Accommodations</p>
          <h2 className="text-left text-3xl md:text-4xl font-bold mb-10 font-headline">
            Our Rooms
          </h2>
          
          {isLoading ? (
            <>
              <RoomsSkeleton />
              <MobileRoomsSkeleton />
            </>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4">
                {rooms[0] && (
                <Link href={`/booking?roomId=${rooms[0]._id}`}
                    className="relative group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full"
                  >
                    <Image
                      src={rooms[0].images?.[0]?.url}
                      alt={rooms[0].roomName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-3xl font-bold">{rooms[0].roomName}</h3>
                      <p className="mb-4">₹{rooms[0].pricePerNight} / per night</p>
                      <Button className="rounded-full bg-[#82c244] hover:bg-[#70a83a] text-white font-bold h-12 px-10 border-none shadow-lg transition-transform hover:scale-105 active:scale-95">
                          Book Now
                      </Button>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {rooms.slice(1, 5).map((room) => (
                    <Link key={room._id} href={`/booking?roomId=${room._id}`}
                      className="relative group overflow-hidden rounded-2xl shadow-lg aspect-square w-full"
                    >
                      <Image
                        src={room.images?.[0]?.url}
                        alt={room.roomName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="text-xl font-bold">{room.roomName}</h4>
                        <p className="mb-3">₹{room.pricePerNight} / per night</p>
                        <Button size="sm" className="rounded-full font-bold h-9 px-6 bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-md border border-white/30 transition-all">
                            Book Now
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="lg:hidden space-y-4">
                <MobileRoomsCarouselWrapper allRoomsForCarousel={rooms} seeMoreImages={seeMoreImages} />
              </div>
            </>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <InteractiveMapSection />
      <BoutiqueTypography />
      <AtmosphereCarousel />

      <motion.section {...fadeInUp} id="experiences" className="bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div>
                  <p className="mb-2" style={sectionLabelStyle}>Experiences</p>
                  <h2 className="text-3xl md:text-4xl font-bold font-headline">
                      Immerse Yourself in the Magic of Himachal
                  </h2>
              </div>
              <div className="flex items-center">
                  <p className="text-foreground/80">
                      At The Forest Gate, we offer a curated collection of experiences designed to immerse you in the natural beauty, rich culture, and serene tranquility of the Himalayas. Each experience is crafted to provide you with unforgettable memories.
                  </p>
              </div>
          </div>
          <ExperiencesCarousel />
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/experiences">Discover All Activities</Link>
            </Button>
          </div>
        </div>
      </motion.section>
      
      <motion.section {...fadeInUp} id="amenities-preview">
          <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div className="max-w-2xl">
                      <p className="mb-2" style={sectionLabelStyle}>Our Offerings</p>
                      <h2 className="text-4xl md:text-5xl font-bold font-headline">
                          Signature Amenities
                      </h2>
                  </div>
                  <Button asChild variant="outline" className="group h-12 rounded-full px-8">
                      <Link href="/amenities" className="flex items-center gap-2">
                          Explore All Amenities
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                  </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {amenities.slice(0, 3).map((amenity) => (
                      <AmenityCard key={amenity.title} amenity={amenity} />
                  ))}
              </div>
          </div>
      </motion.section>

      <motion.div {...fadeInUp}>
        <ManagedBySection />
      </motion.div>
      
      <motion.div {...fadeInUp}>
        <WildlifeCarousel />
      </motion.div>
      
      <motion.div {...fadeInUp}>
        <Testimonials />
      </motion.div>

      <motion.section {...fadeInUp} id="faq" className="bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="mb-2 text-left" style={sectionLabelStyle}>Support</p>
          <h2 className="text-left text-3xl md:text-4xl font-bold mb-10 font-headline">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faqItem, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold text-lg">
                  {faqItem.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  <div dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>

      <motion.div {...fadeInUp}>
        <InfluencersCarousel />
      </motion.div>
    </div>
  );
}
