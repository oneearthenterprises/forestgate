import RetreatDetailClient from '@/components/shared/RetreatDetailClient';
import { RETREATS_DATA } from '@/app/lib/retreatsData';

const retreat = RETREATS_DATA.find((r) => r.id === 'whispering-woods');

export const metadata = {
  title: 'Whispering Woods | Canopy Treehouses & Starlit Nights in Morni Hills',
  description:
    'Experience Whispering Woods at The Forest Gate Trails. Architectural treehouses hovering 30 feet above the pine forest floor, glass stargazing skylights, and acoustic firepit nights in Village Tandeo, Morni Hills, Haryana.',
  keywords: [
    'Whispering Woods Morni Hills',
    'Treehouse Resort Haryana',
    'Canopy Treehouse Chandigarh',
    'Honeymoon Resort Morni Hills',
    'Romantic Treehouse near Delhi',
    'Stargazing Resort Panchkula',
  ],
  alternates: {
    canonical: '/whispering-woods',
  },
  openGraph: {
    title: 'Whispering Woods | Canopy Treehouses & Starlit Nights in Morni Hills',
    description:
      'Sleep under the stars in elevated luxury treehouses with cedar hot tubs and mountain breezes at Whispering Woods.',
    url: 'https://forestgatetrails.com/whispering-woods',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/FORNT%20VIEW%20PROPERTY.png',
        width: 1200,
        height: 630,
        alt: 'Whispering Woods Treehouse at The Forest Gate',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function WhisperingWoodsPage() {
  return <RetreatDetailClient retreat={retreat} />;
}
