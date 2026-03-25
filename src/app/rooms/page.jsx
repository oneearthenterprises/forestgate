import RoomsClient from './RoomsClient';

export const metadata = {
  title: 'Luxury Accommodations & Private Suites',
  description: 'Explore our collection of luxurious rooms and private suites at The Forest Gate. From cozy retreats to family-sized luxury cottages, find your perfect Himalayan sanctuary.',
  keywords: [
    'Luxury Rooms Naggar',
    'Manali Cottage Booking',
    'Himalayan Suite Stay',
    'Private Resort Accommodations',
    'Luxury Stay Manali',
    'Forest View Rooms'
  ],
  alternates: {
    canonical: '/rooms'
  }
};

export default function RoomsPage() {
  return <RoomsClient />;
}
