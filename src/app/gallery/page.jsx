import GalleryClient from './GalleryClient';

export const metadata = {
  title: 'Photo Gallery & Visual Sanctuary | The Forest Gate',
  description: 'Explore the stunning beauty of The Forest Gate and the surrounding Village Tandeo. Morni Hills, Panchkula, Haryana valley through our curated photo gallery. See our luxury rooms, nature trails, and vibrant resort life.',
  keywords: [
    'Morni Hills Resort Photography',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Nature Trails Photos',
    'Forest Gate Gallery',
    'Morni Hills Luxury Resort Images',
    'Morni Hills Sunset Views',
    'Resort Interior Design Morni Hills',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Castle Photography'
  ],
  alternates: {
    canonical: '/gallery'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
