import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog: Insights & Stories | The Forest Gate',
  description: 'Explore the heart of the Himalayas through our blog. From local travel guides and Naggar heritage to resort updates and nature stories, stay connected with The Forest Gate.',
  keywords: [
    'Himachal Travel Guide',
    'Naggar Heritage Stories',
    'Manali Resort Blog',
    'Himalayan Nature Writing',
    'Naggar Castle History',
    'Eco-Tourism Himachal',
    'Forest Gate News'
  ],
  alternates: {
    canonical: '/blog'
  }
};

export default function BlogListingPage() {
  return <BlogClient />;
}
