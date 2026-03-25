import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Photo Gallery & Visual Sanctuary | The Forest Gate',
  description: 'Explore the stunning beauty of The Forest Gate and the surrounding Naggar valley through our curated photo gallery. See our luxury rooms, nature trails, and vibrant resort life.',
  keywords: [
    'Himalayan Resort Photography',
    'Naggar Nature Trails Photos',
    'Forest Gate Gallery',
    'Manali Luxury Resort Images',
    'Himalayan Sunset Views',
    'Resort Interior Design Manali',
    'Naggar Castle Photography'
  ],
  alternates: {
    canonical: '/gallery'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
