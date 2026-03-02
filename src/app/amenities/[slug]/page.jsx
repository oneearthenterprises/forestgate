import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { amenities } from '../../lib/data';
import { PlaceHolderImages } from '../../../lib/placeholder-images';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Sparkles, Sun, Bike, HeartHandshake } from 'lucide-react';

const icons = {
    waves: Waves,
    sparkles: Sparkles,
    sun: Sun,
    bike: Bike,
    'heart-handshake': HeartHandshake,
};

export function generateStaticParams() {
  return amenities.map((amenity) => ({
    slug: amenity.slug,
  }));
}

export default function AmenityDetailPage({ params }) {
  const amenity = amenities.find((a) => a.slug === params.slug);

  if (!amenity) {
    notFound();
  }

  const amenityImage = PlaceHolderImages.find((img) => img.id === amenity.image);
  const otherAmenities = amenities.filter(a => a.slug !== params.slug).slice(0, 3);
  const Icon = icons[amenity.iconName] || Sparkles;

  return (
    <div>
      {amenityImage && (
        <PageHeader
          title={amenity.title}
          subtitle="A closer look at one of our signature offerings."
          imageUrl={amenityImage.imageUrl}
          imageHint={amenityImage.imageHint}
        />
      )}

      <section>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                {amenityImage && (
                    <Image
                    src={amenityImage.imageUrl}
                    alt={amenity.title}
                    width={800}
                    height={600}
                    className="rounded-lg shadow-lg object-cover w-full aspect-[4/3]"
                    data-ai-hint={amenityImage.imageHint}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                    />
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl flex items-center gap-4">
                            <Icon className="w-8 h-8 text-primary shrink-0" />
                            {amenity.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-lg text-foreground/80">
                            {amenity.longDescription}
                        </p>
                        <p className="text-foreground/80">
                            Immerse yourself in luxury and comfort with our top-of-the-line amenities. We have carefully curated each facility to ensure your stay at Himachal Haven is nothing short of exceptional.
                        </p>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/booking">Book Your Stay</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-headline text-3xl md:text-4xl font-bold mb-10">
            Discover More Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherAmenities.map((other) => {
              const otherImage = PlaceHolderImages.find(img => img.id === other.image);
              return (
                <Link key={other.slug} href={`/amenities/${other.slug}`}>
                    <Card className="overflow-hidden h-full group">
                        {otherImage && (
                            <div className="relative aspect-video">
                                <Image
                                    src={otherImage.imageUrl}
                                    alt={other.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={otherImage.imageHint}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                />
                             </div>
                        )}
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{other.title}</CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
