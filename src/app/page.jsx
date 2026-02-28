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
import { Flame, Heart, Star } from 'lucide-react';
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

  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-1');

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
    }
    const image = PlaceHolderImages.find(img => img.id === imageId);
    return { ...highlight, image };
  }).filter(h => !!h.image);


  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <HeroScroll />

        <section id="highlights" className="bg-card">
          <div className="container mx-auto px-4">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {highlightsWithImages.map((highlight) => (
                  <CarouselItem key={highlight.title} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <div className="relative group overflow-hidden rounded-3xl shadow-lg aspect-[4/5]">
                        {highlight.image && (
                          <Image
                            src={highlight.image.imageUrl}
                            alt={highlight.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={highlight.image.imageHint}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="font-headline text-3xl font-bold">
                            {highlight.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </section>

        <section id="about-preview">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
                  Your Sanctuary in the Mountains
                </h2>
                <p className="mb-4 text-lg text-foreground/80">
                  Nestled away from the bustle, Himachal Haven is a testament to
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
            <h2 className="text-center font-headline text-3xl md:text-4xl font-bold mb-10">
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

        <section id="experiences" className="bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div>
                    <p className="text-primary font-bold mb-2 tracking-widest uppercase">Experiences</p>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">
                        Immerse Yourself in the Magic of Himachal
                    </h2>
                </div>
                <div className="flex items-center">
                    <p className="text-foreground/80">
                        At Himachal Haven, we offer a curated collection of experiences designed to immerse you in the natural beauty, rich culture, and serene tranquility of the Himalayas. Each experience is crafted to provide you with unforgettable memories.
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
                <h2 className="text-center font-headline text-3xl md:text-4xl font-bold mb-10">
                    Signature Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {amenities.slice(0, 3).map((amenity) => (
                        <AmenityCard key={amenity.title} amenity={amenity} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg">
                        <Link href="/amenities">Explore All Amenities</Link>
                    </Button>
                </div>
            </div>
        </section>

        <Testimonials />

        <section id="faq" className="bg-card">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-center font-headline text-3xl md:text-4xl font-bold mb-10">
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
      </main>
    </div>
  );
}
