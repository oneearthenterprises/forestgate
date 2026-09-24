import RetreatDetailClient from '@/components/shared/RetreatDetailClient';
import { RETREATS_DATA } from '@/app/lib/retreatsData';

const retreat = RETREATS_DATA.find((r) => r.id === 'the-green-escape');

export const metadata = {
  title: 'The Green Escape | Verdant Valley Hideaway & Organic Dining in Morni Hills',
  description:
    'Experience The Green Escape at The Forest Gate Trails. An emerald valley sanctuary dedicated to farm-to-table organic dining, aromatherapy gardens, digital detox, and deep mountain tranquility in Village Tandeo, Morni Hills, Haryana.',
  keywords: [
    'The Green Escape Morni Hills',
    'Organic Farm Resort Haryana',
    'Digital Detox Resort Chandigarh',
    'Wellness Sanctuary Panchkula',
    'Open Sky Dining Morni Hills',
    'Sustainable Luxury Getaway',
  ],
  alternates: {
    canonical: '/the-green-escape',
  },
  openGraph: {
    title: 'The Green Escape | Verdant Valley Hideaway & Organic Dining in Morni Hills',
    description:
      'Immerse in farm-to-table culinary journeys, aromatherapy gardens, and valley views at The Green Escape, Morni Hills.',
    url: 'https://forestgatetrails.com/the-green-escape',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/Open%20Sky%20Dining.png',
        width: 1200,
        height: 630,
        alt: 'The Green Escape at The Forest Gate',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TheGreenEscapePage() {
  return <RetreatDetailClient retreat={retreat} />;
}
