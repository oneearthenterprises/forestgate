import RoomsClient from './RoomsClient';

export const metadata = {
  title: 'Luxury Accommodations & Private Suites',
  description: 'Explore our collection of luxurious rooms and private suites at The Forest Gate. From cozy retreats to family-sized luxury cottages, find your perfect Morni Hills sanctuary.',
  keywords: [
    'Luxury Rooms Village Tandeo. Morni Hills, Panchkula, Haryana',
    'Morni Hills Cottage Booking',
    'Morni Hills Suite Stay',
    'Private Resort Accommodations',
    'Luxury Stay Morni Hills',
    'Forest View Rooms'
  ],
  alternates: {
    canonical: '/rooms'
  }
};

export default function RoomsPage() {
  return <RoomsClient />;
}
