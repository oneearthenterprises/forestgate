import RetreatDetailClient from '@/components/shared/RetreatDetailClient';
import { RETREATS_DATA } from '@/app/lib/retreatsData';

const retreat = RETREATS_DATA.find((r) => r.id === 'natures-gate');

export const metadata = {
  title: 'Nature’s Gate | Mountain Gateway, Trekking Enclave & River Trails in Morni Hills',
  description:
    'Discover Nature’s Gate at The Forest Gate Trails. An active wilderness and adventure sanctuary featuring marked mountain trails, riverbed bouldering, cliffside pool sunsets, and mountain biking in Village Tandeo, Morni Hills, Haryana.',
  keywords: [
    'Nature’s Gate Morni Hills',
    'Adventure Resort Haryana',
    'Trekking Resort near Chandigarh',
    'Mountain Biking Morni Hills',
    'River Trail Resort Panchkula',
    'Outdoor Activities Haryana',
  ],
  alternates: {
    canonical: '/natures-gate',
  },
  openGraph: {
    title: 'Nature’s Gate | Mountain Gateway, Trekking Enclave & River Trails in Morni Hills',
    description:
      'The thrilling gateway to mountain trekking, river expeditions, and cliffside sunsets at Nature’s Gate, Morni Hills.',
    url: 'https://forestgatetrails.com/natures-gate',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/TREKKING.png',
        width: 1200,
        height: 630,
        alt: 'Nature’s Gate at The Forest Gate',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function NaturesGatePage() {
  return <RetreatDetailClient retreat={retreat} />;
}
