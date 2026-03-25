import AboutClient from './AboutClient';

export const metadata = {
  title: 'Our Story & Heritage',
  description: 'Learn about the vision behind The Forest Gate, our commitment to sustainable luxury, and our journey to creating a Himalayan sanctuary in Naggar, Manali.',
  keywords: [
    'About The Forest Gate',
    'Resort Founders',
    'Sustainable Luxury Vision',
    'Himachal Heritage',
    'Naggar Manali History',
    'Eco-friendly Resort Story'
  ],
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
