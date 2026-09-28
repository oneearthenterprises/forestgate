import HomeClient from './HomeClient';

export const metadata = {
  title: 'Forest gate Retreat and Trails Village Tandeo. Morni Hills, Panchkula, Haryana',
  description:
    'Experience sustainable luxury at The Forest Gate, Village Tandeo. Morni Hills, Panchkula, Haryana. A premier Morni Hills sanctuary offering private suites, nature trails, and world-class amenities in a pollution-free environment.',
  keywords: [
    'The Forest Gate',
    'Luxury Resort Haryana',
    'Village Tandeo. Morni Hills, Panchkula, Haryana Morni Hills Resort',
    'Sustainable Luxury Morni Hills',
    'Best Resort for Families Morni Hills',
    'Adventure Resort Haryana',
    'Luxury Cottage Morni Hills',
    'Haryana Tourism',
    'Morni Hills Sanctuary',
    'Village Tandeo. Morni Hills, Panchkula, Haryana View Resort',
    'Luxury Stay Haryana',
  ],
  alternates: {
    canonical: '/',
  },
};

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Resort',
      '@id': 'https://forestgatetrails.com/#resort',
      name: 'The Forest Gate Trails',
      alternateName: 'The Forest Gate - Luxury Resort & Sanctuary',
      description:
        'Discover The Forest Gate, a luxury resort offering a unique blend of nature, adventure, and tranquility in Village Tandeo, Morni Hills, Panchkula, Haryana. Perfect for families, couples, and corporate retreats.',
      url: 'https://forestgatetrails.com/',
      logo: 'https://forestgatetrails.com/assets/images/forestgatelogo.svg',
      image: [
        'https://forestgatetrails.com/assets/images/banner.jpeg',
        'https://forestgatetrails.com/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png',
        'https://forestgatetrails.com/assets/images/forestgate-image/FORNT%20VIEW%20PROPERTY.png',
      ],
      telephone: '+91 70099 84070',
      email: 'Support@forestgatetrails.com',
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
      starRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      checkinTime: '14:00',
      checkoutTime: '11:00',
      petsAllowed: true,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Village Tandeo, Morni Hills',
        addressLocality: 'Panchkula',
        addressRegion: 'Haryana',
        postalCode: '134205',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 30.6972,
        longitude: 77.0869,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128',
        bestRating: '5',
        worstRating: '1',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private Mountain View Lawns', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Stargazing Decks', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bonfire & Firepits', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Complimentary High-speed Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Farm-to-Fork Mountain Dining', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Guided Nature & River Trails', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly Resort', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Secured Parking', value: true },
      ],
      sameAs: [
        'https://www.facebook.com/profile.php?id=61588259480467#',
        'https://www.instagram.com/forestgate.retreat/?hl=en',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://forestgatetrails.com/#website',
      url: 'https://forestgatetrails.com/',
      name: 'The Forest Gate',
      description: 'Luxury Meets Nature in the Heart of Haryana',
      publisher: {
        '@id': 'https://forestgatetrails.com/#resort',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://forestgatetrails.com/#organization',
      name: 'The Forest Gate Trails',
      url: 'https://forestgatetrails.com/',
      logo: 'https://forestgatetrails.com/assets/images/forestgatelogo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91 70099 84070',
        contactType: 'reservations',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
      sameAs: [
        'https://www.facebook.com/profile.php?id=61588259480467#',
        'https://www.instagram.com/forestgate.retreat/?hl=en',
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HomeClient />
    </>
  );
}
