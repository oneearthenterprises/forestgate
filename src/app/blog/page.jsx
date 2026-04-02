import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog: Insights & Stories | The Forest Gate',
  description: 'Explore the heart of the Morni Hills through our blog. From local travel guides and Village Tandeo. Morni Hills, Panchkula, Haryana heritage to resort updates and nature stories, stay connected with The Forest Gate.',
  keywords: [
    'Haryana Travel Guide',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Heritage Stories',
    'Morni Hills Resort Blog',
    'Morni Hills Nature Writing',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Castle History',
    'Eco-Tourism Haryana',
    'Forest Gate News'
  ],
  alternates: {
    canonical: '/blog'
  }
};

export default function BlogListingPage() {
  return <BlogClient />;
}
