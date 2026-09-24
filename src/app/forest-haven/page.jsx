import RetreatDetailClient from '@/components/shared/RetreatDetailClient';
import { RETREATS_DATA } from '@/app/lib/retreatsData';

const retreat = RETREATS_DATA.find((r) => r.id === 'forest-haven');

export const metadata = {
  title: 'Forest Haven | Eco-Luxury Forest Villas & Creek Trails in Morni Hills',
  description:
    'Discover Forest Haven at The Forest Gate Trails. A bird-rich, pet-welcoming eco-luxury retreat featuring sunlit verandas, creek-side trails, organic orchards, and gentle Himalayan breezes in Village Tandeo, Morni Hills.',
  keywords: [
    'Forest Haven Morni Hills',
    'Eco Luxury Resort Haryana',
    'Birdwatching Resort near Chandigarh',
    'Pet Friendly Resort Panchkula',
    'Family Forest Cottage Morni',
    'Nature Stay near Delhi NCR',
  ],
  alternates: {
    canonical: '/forest-haven',
  },
  openGraph: {
    title: 'Forest Haven | Eco-Luxury Forest Villas & Creek Trails in Morni Hills',
    description:
      'Unwind in peaceful garden cottages with 60+ Himalayan bird species and private creek trails at Forest Haven, Morni Hills.',
    url: 'https://forestgatetrails.com/forest-haven',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/PROPERTTY.png',
        width: 1200,
        height: 630,
        alt: 'Forest Haven at The Forest Gate',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ForestHavenPage() {
  return <RetreatDetailClient retreat={retreat} />;
}
