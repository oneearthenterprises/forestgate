import { PageHeader } from "@/components/shared/PageHeader";
import { amenities } from "../lib/data";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import { CheckCircle } from "lucide-react";
import { AmenityCard } from "@/components/shared/AmenityCard";

export const metadata = {
  title: 'Premium Resort Amenities & Guest Facilities',
  description: 'Explore the world-class amenities at The Forest Gate, Naggar. From our swimming pool and private cinema to cozy bonfire pits and luxury dining, we offer everything for a perfect Himalayan stay.',
  keywords: [
    'Naggar Swimming Pool Resort',
    'Private Cinema Manali',
    'Bonfire Resort Himachal',
    'Luxury Dining Naggar',
    'Naggar Resort Facilities',
    'Best Amenities Manali Resort',
    'Forest Gate Facilities'
  ],
  alternates: {
    canonical: '/amenities'
  }
};

export default function AmenitiesPage() {
  const headerImage = PlaceHolderImages.find((img) => img.id === "amenity-pool");
  const otherAmenities = [
    "Free High-Speed Wi-Fi",
    "Ample Free Parking",
    "24/7 Front Desk",
    "Daily Housekeeping",
    "Laundry Service",
    "Doctor on Call",
  ];

  return (
    <div>
      {headerImage && (
        <PageHeader
          title="Our Amenities"
          subtitle="Designed for your comfort, convenience, and delight."
          imageUrl={headerImage.imageUrl}
          imageHint={headerImage.imageHint}
        />
      )}

      <section>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">
              Facilities & Services
            </h2>
            <p className="text-lg text-foreground/80">
              At The Forest Gate, we've curated a collection of amenities to
              ensure your stay is as comfortable and memorable as possible. From
              relaxation to recreation, we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity) => (
              <AmenityCard key={amenity.title} amenity={amenity} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-headline text-3xl font-bold mb-8">
            Standard Inclusions
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {otherAmenities.map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
