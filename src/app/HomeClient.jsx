'use client';

// The Forest Gate - Home Client
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  highlights,
  amenities,
  experiences,
  wildlifeViewpoints,
  faqs,
} from '@/app/lib/data';
import galleryImages from '@/lib/gallery-images.json';
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
import { AmenitiesCarousel } from '@/components/shared/AmenitiesCarousel';
import { ExperiencesCarousel } from '@/components/shared/ExperiencesCarousel';
import { HeroScroll } from '@/components/shared/HeroScroll';
import { InteractiveMapSection } from '@/components/shared/InteractiveMapSection';
import { ManagedBySection } from '@/components/shared/ManagedBySection';
import { WildlifeCarousel } from '@/components/shared/WildlifeCarousel';
import { InfluencersCarousel } from '@/components/shared/InfluencersCarousel';
import { HighlightsCarouselWrapper } from '@/components/shared/HighlightsCarouselWrapper';
import { WelcomePopup } from '@/components/shared/WelcomePopup';
import { AtmosphereCarousel } from '@/components/shared/AtmosphereCarousel';
import { RoomsSlider } from '@/components/shared/RoomsSlider';
import { MustExperienceSlider } from '@/components/shared/MustExperienceSlider';
import { API } from '@/lib/api/api';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const router = useRouter();

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
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg w-full h-[300px] md:h-[500px]  transition-transform duration-700 group-hover:scale-105 object-cover"
                data-ai-hint="deep forest"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </motion.section>



      <InteractiveMapSection />
      <motion.div {...fadeInUp}>
        <RoomsSlider rooms={rooms} isLoading={isLoading} />
      </motion.div>
      <AtmosphereCarousel />

      <motion.div {...fadeInUp}>
        <MustExperienceSlider
          title="Must-do experiences"
          description="These essential Forest Gate sanctuaries and experiences belong on every visitor's list. Don't leave without ticking off these unforgettable moments."
          wide={true}
        />
      </motion.div>

      <motion.section {...fadeInUp} id="experiences" className="bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <p className="mb-2" style={sectionLabelStyle}>Experiences</p>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                Immerse Yourself in the Magic of Haryana
              </h2>
            </div>
            <div className="flex items-center">
              <p className="text-foreground/80">
                At The Forest Gate, we offer a curated collection of experiences designed to immerse you in the natural beauty, rich culture, and serene tranquility of the Morni Hills. Each experience is crafted to provide you with unforgettable memories.
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
          <div className="mb-16">
            <div className="max-w-2xl">
              <p className="mb-2" style={sectionLabelStyle}>Our Offerings</p>
              <h2 className="text-4xl md:text-5xl font-bold font-headline">
                Signature Amenities
              </h2>
            </div>
          </div>
          <AmenitiesCarousel />
          <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/amenities" className="flex items-center gap-2 justify-center w-max mx-auto">
                Explore All Amenities
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
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
        <div className="container mx-auto px-4">
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
