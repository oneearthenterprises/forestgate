import ExperiencesClient from './ExperiencesClient';

export const metadata = {
  title: 'Himalayan Adventures & Nature Experiences',
  description: 'Discover curated activities at The Forest Gate, Naggar. From high-altitude trekking and stargazing to riverside picnics and local cultural tours, immerse yourself in the magic of Himachal.',
  keywords: [
    'Himalayan Trekking Naggar',
    'Adventure Activities Manali',
    'Nature Experiences Himachal',
    'Stargazing Resort Manali',
    'River Side Picnic Naggar',
    'Naggar Cultural Tours',
    'Outdoor Activities Himachal'
  ],
  alternates: {
    canonical: '/experiences'
  }
};

export default function ExperiencesPage() {
  return <ExperiencesClient />;
}
