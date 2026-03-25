import HomeClient from './HomeClient';

export const metadata = {
  title: 'The Forest Gate | Luxury Resort in Naggar, Manali',
  description: 'Experience sustainable luxury at The Forest Gate, Naggar. A premier Himalayan sanctuary offering private suites, nature trails, and world-class amenities in a pollution-free environment.',
  keywords: [
    'The Forest Gate',
    'Luxury Resort Himachal',
    'Naggar Manali Resort',
    'Sustainable Luxury Manali',
    'Best Resort for Families Manali',
    'Adventure Resort Himachal',
    'Luxury Cottage Manali',
    'Himachal Tourism',
    'Himalayan Sanctuary',
    'Naggar View Resort',
    'Luxury Stay Himachal'
  ],
  alternates: {
    canonical: '/'
  }
};

export default function Home() {
  return <HomeClient />;
}
