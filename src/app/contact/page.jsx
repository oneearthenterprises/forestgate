import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us & Location | Naggar, Manali',
  description: 'Get in touch with The Forest Gate, Naggar. Find our address, phone number, and location map, or send us a message for bookings and inquiries about your Himalayan stay.',
  keywords: [
    'Contact Forest Gate Naggar',
    'Manali Resort Phone Number',
    'Naggar Resort Address',
    'Book Resort Naggar',
    'Forest Gate Location Map',
    'Himachal Tourism Enquiry',
    'Naggar Castle Nearby Hotels'
  ],
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
