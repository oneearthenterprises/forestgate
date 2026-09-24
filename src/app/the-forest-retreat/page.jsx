import RetreatDetailClient from '@/components/shared/RetreatDetailClient';
import { RETREATS_DATA } from '@/app/lib/retreatsData';

const retreat = RETREATS_DATA.find((r) => r.id === 'the-forest-retreat');

export const metadata = {
  title: 'The Forest Retreat | Secluded Luxury Mountain Sanctuary in Morni Hills',
  description:
    'Experience The Forest Retreat at The Forest Gate Trails. A secluded hilltop sanctuary of private forest villas, heated stone jacuzzi decks, pine forest bathing, and farm-to-fork mountain cuisine in Village Tandeo, Morni Hills, Haryana.',
  keywords: [
    'The Forest Retreat Morni Hills',
    'Luxury Mountain Sanctuary Haryana',
    'Private Forest Villa Panchkula',
    'Hilltop Eco Resort Chandigarh',
    'Forest Bathing Morni Hills',
    'Weekend Luxury Getaway from Delhi NCR',
  ],
  alternates: {
    canonical: '/the-forest-retreat',
  },
  openGraph: {
    title: 'The Forest Retreat | Secluded Luxury Mountain Sanctuary in Morni Hills',
    description:
      'Immerse in private pine forest chalets, starlight firepits, and panoramic mountain views at The Forest Retreat, Morni Hills.',
    url: 'https://forestgatetrails.com/the-forest-retreat',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png',
        width: 1200,
        height: 630,
        alt: 'The Forest Retreat at The Forest Gate',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TheForestRetreatPage() {
  return <RetreatDetailClient retreat={retreat} />;
}
