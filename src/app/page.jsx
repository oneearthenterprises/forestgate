
import {
  faqs,
  galleryImages,
  highlights,
  rooms,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Heart, Star, ArrowRight } from 'lucide-react';
import { AmenityCard } from '@/components/shared/AmenityCard';
import { ExperiencesCarousel } from '@/components/shared/ExperiencesCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { HeroScroll } from '@/components/shared/HeroScroll';
import { InteractiveMapSection } from '@/components/shared/InteractiveMapSection';
import { ManagedBySection } from '@/components/shared/ManagedBySection';
import { WildlifeCarousel } from '@/components/shared/WildlifeCarousel';
import { InfluencersCarousel } from '@/components/shared/InfluencersCarousel';

export default function Home() {
  const deluxeRoom = rooms.find((r) => r.id === 'deluxe-room');
  const singleRoom = rooms.find((r) => r.id === 'single-room');
  const doubleRoom = rooms.find((r) => r.id === 'double-room');
  const familyRoom = rooms.find((r) => r.id === 'family-room');
  const seeMoreImages = galleryImages
    .slice(0, 4)
    .map((img) => PlaceHolderImages.find((p) => p.id === img.id))
    .filter(Boolean);

  const allRoomsForCarousel = [deluxeRoom, singleRoom, doubleRoom, familyRoom].filter((r) => !!r);

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

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <HeroScroll />

        <section 
          id="highlights" 
          className="py-[10px] px-4 md:px-[81px]" 
          style={{ background: 'linear-gradient(to bottom, #70ac43, #ffffff)' }}
        >
          <div className="container mx-auto px-0">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {highlightsWithImages.map((highlight) => (
                  <CarouselItem key={highlight.title} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="flex flex-col items-center gap-4 group py-12">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-[150px] md:h-[150px] overflow-hidden rounded-full shadow-2xl transition-all duration-500 group-hover:scale-105 border-4 border-white/10">
                        {highlight.image && (
                          <Image
                            src={highlight.image.imageUrl}
                            alt={highlight.title}
                            fill
                            className="object-cover"
                            data-ai-hint={highlight.image.imageHint}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="text-base md:text-xl font-bold tracking-tight text-foreground transition-colors duration-300">
                          {highlight.title}
                        </h3>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-none bg-white/30 text-white hover:bg-white/50" />
              <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-none bg-white/30 text-white hover:bg-white/50" />
            </Carousel>
          </div>
        </section>

        <section id="about-preview">
          <div className="container mx-auto px-4">
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
              <div>
                <Image
                  src="https://picsum.photos/seed/resort-about/600/400"
                  alt="Peaceful view of the resort"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  data-ai-hint="resort exterior"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                />
              </div>
            </div>
          </div>
        </section>

        <section id="rooms" className="bg-card">
          <div className="container mx-auto px-4">
            <p className="mb-2 text-left" style={sectionLabelStyle}>Accommodations</p>
            <h2 className="text-left text-3xl md:text-4xl font-bold mb-10 font-headline">
              Our Rooms
            </h2>
             {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-4">
              {deluxeRoom &&
                (() => {
                  const roomImage = PlaceHolderImages.find(
                    (img) => img.id === deluxeRoom.images[0]
                  );
                  return (
                    <Link
                      href={`/rooms#${deluxeRoom.id}`}
                      className="relative group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full"
                    >
                      {roomImage && (
                        <Image
                          src={roomImage.imageUrl}
                          alt={deluxeRoom.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={roomImage.imageHint}
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                      {deluxeRoom.badge && (
                        <div
                          className={
                            'absolute top-4 left-4 flex items-center gap-2 text-white px-3 py-1 rounded-full text-sm font-bold bg-red-500/90'
                          }
                        >
                          <Flame size={16} />
                          <span>{deluxeRoom.badge.label}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-headline text-3xl font-bold">
                          {deluxeRoom.name}
                        </h3>
                        <p className="text-lg">
                          ₹{deluxeRoom.price.toLocaleString()} / per night
                        </p>
                      </div>
                    </Link>
                  );
                })()}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[singleRoom, doubleRoom, familyRoom].map(
                  (room) =>
                    room &&
                    (() => {
                      const roomImage = PlaceHolderImages.find(
                        (img) => img.id === room.images[0]
                      );
                      return (
                        <Link
                          key={room.id}
                          href={`/rooms#${room.id}`}
                          className="relative group overflow-hidden rounded-2xl shadow-lg aspect-square w-full"
                        >
                          {roomImage && (
                            <Image
                              src={roomImage.imageUrl}
                              alt={room.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={roomImage.imageHint}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                          {room.badge && (
                            <div
                              className={`absolute top-4 left-4 flex items-center gap-2 text-white px-3 py-1 rounded-full text-xs font-bold ${
                                room.badge.variant === 'liked'
                                  ? 'bg-purple-500/90'
                                  : 'bg-red-500/90'
                              }`}
                            >
                              {room.badge.variant === 'liked' ? (
                                <Heart size={14} />
                              ) : (
                                <Flame size={14} />
                              )}
                              <span>{room.badge.label}</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h4 className="font-headline text-xl font-bold">
                              {room.name}
                            </h4>
                            <p className="text-sm">
                              ₹{room.price.toLocaleString()} / per night
                            </p>
                            {room.rating && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={
                                        i < room.rating.stars
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-400'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-bold bg-green-600 px-2 py-0.5 rounded">
                                  {room.rating.label}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })()
                )}
                <Link
                  href="/rooms"
                  className="relative group overflow-hidden rounded-2xl shadow-lg aspect-square w-full"
                >
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                    {seeMoreImages.map(
                      (image, index) =>
                        image && (
                          <div
                            key={index}
                            className="relative h-full w-full overflow-hidden"
                          >
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={image.imageHint}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                            />
                          </div>
                        )
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <h4 className="font-headline text-2xl font-bold">
                      See more
                    </h4>
                    <p>+10 more</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <Carousel opts={{ align: "start", loop: true }} className="w-full -ml-4">
                <CarouselContent>
                  {allRoomsForCarousel.map((room) => {
                      const roomImage = PlaceHolderImages.find((img) => img.id === room.images[0]);
                      return (
                          <CarouselItem key={room.id} className="basis-full sm:basis-1/2 pl-4">
                              <div className="p-1">
                                  <Link
                                      href={`/rooms#${room.id}`}
                                      className="relative block group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full"
                                  >
                                      {roomImage && (
                                          <Image
                                              src={roomImage.imageUrl}
                                              alt={room.name}
                                              fill
                                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                                              data-ai-hint={roomImage.imageHint}
                                              placeholder="blur"
                                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                          />
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
                                      {room.badge && (
                                          <div
                                              className={`absolute top-4 left-4 flex items-center gap-2 text-white px-3 py-1 rounded-full text-sm font-bold ${
                                                  room.badge.variant === 'hot' ? 'bg-red-500/90' : 'bg-purple-500/90'
                                              }`}
                                          >
                                              {room.badge.variant === 'liked' ? <Heart size={16} /> : <Flame size={16} />}
                                              <span>{room.badge.label}</span>
                                          </div>
                                      )}
                                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                          <h3 className="font-headline text-3xl font-bold">{room.name}</h3>
                                          <p className="text-lg">₹{room.price.toLocaleString()} / per night</p>
                                          {room.rating && (
                                              <div className="flex items-center gap-2 mt-2">
                                                  <div className="flex">
                                                      {[...Array(5)].map((_, i) => (
                                                          <Star
                                                              key={i}
                                                              size={16}
                                                              className={
                                                                  i < room.rating.stars
                                                                      ? 'text-yellow-400 fill-yellow-400'
                                                                      : 'text-gray-400'
                                                              }
                                                          />
                                                      ))}
                                                  </div>
                                                  <span className="text-xs font-bold bg-green-600 px-2 py-0.5 rounded">
                                                      {room.rating.label}
                                                  </span>
                                              </div>
                                          )}
                                      </div>
                                  </Link>
                              </div>
                          </CarouselItem>
                      );
                  })}
                  <CarouselItem className="basis-full sm:basis-1/2 pl-4">
                      <div className="p-1 h-full">
                          <Link
                              href="/rooms"
                              className="relative group overflow-hidden rounded-2xl shadow-lg aspect-[4/5] w-full block h-full"
                          >
                              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                                  {seeMoreImages.slice(0,4).map((image, index) => (
                                      image && (
                                          <div key={index} className="relative h-full w-full overflow-hidden">
                                              <Image
                                                  src={image.imageUrl}
                                                  alt={image.description}
                                                  fill
                                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                  data-ai-hint={image.imageHint}
                                                  placeholder="blur"
                                                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                              />
                                          </div>
                                      )
                                  ))}
                              </div>
                              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                                  <h4 className="font-headline text-2xl font-bold">See more</h4>
                                  <p>+10 more</p>
                              </div>
                          </Link>
                      </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center mt-4 gap-2">
                    <CarouselPrevious className="static translate-y-0"/>
                    <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/rooms">View All Rooms</Link>
              </Button>
            </div>
          </div>
        </section>

        <InteractiveMapSection />

        <section id="experiences" className="bg-card">
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
        </section>
        
        <section id="amenities-preview">
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
        </section>

        <ManagedBySection />
        <WildlifeCarousel />
        <Testimonials />

        <section id="faq" className="bg-card">
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
                    {faqItem.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <InfluencersCarousel />
      </main>
    </div>
  );
}
