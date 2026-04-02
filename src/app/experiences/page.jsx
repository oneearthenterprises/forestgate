import ExperiencesClient from './ExperiencesClient';

export const metadata = {
  title: 'Morni Hills Adventures & Nature Experiences',
  description: 'Discover curated activities at The Forest Gate, Village Tandeo. Morni Hills, Panchkula, Haryana. From high-altitude trekking and stargazing to riverside picnics and local cultural tours, immerse yourself in the magic of Haryana.',
  keywords: [
    'Morni Hills Trekking Village Tandeo. Morni Hills, Panchkula, Haryana',
    'Adventure Activities Morni Hills',
    'Nature Experiences Haryana',
    'Stargazing Resort Morni Hills',
    'River Side Picnic Village Tandeo. Morni Hills, Panchkula, Haryana',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Cultural Tours',
    'Outdoor Activities Haryana'
  ],
  alternates: {
    canonical: '/experiences'
  }
};

export default function ExperiencesPage() {
  return <ExperiencesClient />;
}
