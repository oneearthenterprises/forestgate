
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { rooms, galleryImages } from '../lib/data';
import { PlaceHolderImages } from '../../lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function RoomsPage() {
  const headerImage = PlaceHolderImages.find((img) => img.id === 'room-suite-1');

  return (
    <div>
      {headerImage && (
        <PageHeader
          title="Our Accommodations"
          subtitle="Explore the luxurious rooms and suites included when you book the entire resort."
          imageUrl={headerImage.imageUrl}
          imageHint={headerImage.imageHint}
        />
      )}

      <section>
        <div className="container mx-auto px-4">
          <Tabs defaultValue="accommodations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-16 h-14 p-1.5 rounded-full bg-muted/50 border border-border/50">
              <TabsTrigger 
                value="accommodations" 
                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg"
              >
                Accommodations
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-lg"
              >
                Gallery
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="accommodations" className="mt-0">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">
                  Experience Private Luxury
                </h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  For ultimate privacy and a truly bespoke experience, book
                  the entire The Forest Gate. You'll get exclusive access to
                  all our accommodations and world-class amenities.
                </p>
                <Button asChild size="lg" variant="secondary" className="px-10 h-14 text-lg font-bold">
                  <Link href="/booking">Book Entire Resort</Link>
                </Button>
              </div>

              <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    id={room.id}
                    className="group bg-card border border-border/50 rounded-[2.5rem] overflow-hidden p-4 md:p-6 flex flex-col md:flex-row items-center gap-8 transition-all duration-500 hover:shadow-2xl hover:border-primary/20"
                  >
                    {/* Left: Image/Carousel */}
                    <div className="w-full md:w-[35%] shrink-0">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {room.images.map((imgId) => {
                            const img = PlaceHolderImages.find(
                              (p) => p.id === imgId
                            );
                            return (
                              <CarouselItem key={imgId}>
                                {img && (
                                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner">
                                    <Image
                                      src={img.imageUrl}
                                      alt={`${room.name}`}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                      data-ai-hint={img.imageHint}
                                    />
                                  </div>
                                )}
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Carousel>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 space-y-4 py-2">
                      <div className="space-y-1">
                        <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-muted/30">
                          {room.badge?.label || 'Premium Stay'}
                        </Badge>
                        <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                          {room.name}
                        </h3>
                      </div>
                      
                      <p className="text-foreground/60 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-2">
                        {room.longDescription}
                      </p>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-dashed">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-1">Price per night</p>
                          <p className="font-headline text-xl font-bold text-primary">₹{room.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-1">Key Amenity</p>
                          <p className="text-sm font-bold truncate">{room.amenities[0]?.name || 'Mountain View'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 md:min-w-[180px] md:pl-6 md:border-l md:border-dashed">
                      <Button asChild variant="secondary" className="h-14 px-8 font-bold text-base shadow-none">
                        <Link href={`/booking?roomId=${room.id}`}>Book Now</Link>
                      </Button>
                      <Button asChild variant="ghost" className="h-12 font-bold text-sm hover:bg-muted/50 group/btn">
                        <Link href={`/rooms#${room.id}`} className="flex items-center justify-center gap-2">
                          See Details
                          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {galleryImages.map((image) => {
                  const imageData = PlaceHolderImages.find(
                    (p) => p.id === image.id
                  );
                  if (!imageData) return null;
                  return (
                    <div key={image.id} className="break-inside-avoid">
                      <Image
                        src={imageData.imageUrl}
                        alt={imageData.description}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-[2rem] shadow-md transition-transform duration-500 hover:scale-[1.02]"
                        data-ai-hint={imageData.imageHint}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
