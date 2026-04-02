import AboutClient from './AboutClient';

export const metadata = {
  title: 'Our Story & Heritage',
  description: 'Learn about the vision behind The Forest Gate, our commitment to sustainable luxury, and our journey to creating a Morni Hills sanctuary in Village Tandeo. Morni Hills, Panchkula, Haryana.',
  keywords: [
    'About The Forest Gate',
    'Resort Founders',
    'Sustainable Luxury Vision',
    'Haryana Heritage',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Morni Hills History',
    'Eco-friendly Resort Story'
  ],
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
