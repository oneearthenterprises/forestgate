import WildwoodClient from '../wildwood_retreat/WildwoodClient';

export const metadata = {
  title: 'Wildwood Retreat | Secluded Eco-Luxury Haven in Morni Hills',
  description:
    'Experience Wildwood Retreat at The Forest Gate Trails. A secluded sanctuary of private forest villas, open-sky stargazing decks, riverside trails, and bespoke culinary journeys in Village Tandeo, Morni Hills, Panchkula, Haryana.',
  keywords: [
    'Wildwood Retreat Morni Hills',
    'Luxury Forest Villa Haryana',
    'Secluded Nature Resort Panchkula',
    'Morni Hills Eco Retreat',
    'Private Cottage Stargazing Morni',
    'The Forest Gate Trails Wildwood',
    'Weekend Getaway from Chandigarh',
    'Best Nature Stay near Delhi NCR',
  ],
  alternates: {
    canonical: '/wildwood-retreat',
  },
  openGraph: {
    title: 'Wildwood Retreat | Secluded Eco-Luxury Haven in Morni Hills',
    description:
      'Immerse in private forest villas, stargazing decks, riverside trails, and mountain tranquility at Wildwood Retreat, Morni Hills.',
    url: 'https://forestgatetrails.com/wildwood-retreat',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png',
        width: 1200,
        height: 630,
        alt: 'Wildwood Retreat at The Forest Gate Trails',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function WildwoodRetreatHyphenPage() {
  return <WildwoodClient />;
}
