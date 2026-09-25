import WildwoodClient from './WildwoodClient';

export const metadata = {
  title: 'Wildwood Retreat | Secluded Eco-Luxury Haven in Morni Hills',
  description:
    'Experience Wildwood Retreat at The Forest Gate Trails. A secluded sanctuary of private forest villas, open-sky stargazing decks, riverside trails, and bespoke culinary journeys in Village Tandeo, Morni Hills, Panchkula, Haryana.',
  keywords: [
    'Wildwood Retreat Morni Hills',
    'Luxury Forest Villa Haryana',
    'Secluded Nature Resort Panchkula',
    'Morni Hills Eco Retreat',
    'Private Cottage Stargazing Morni',
    'The Forest Gate Trails Wildwood',
    'Weekend Getaway from Chandigarh',
    'Best Nature Stay near Delhi NCR',
  ],
  alternates: {
    canonical: '/wildwood_retreat',
  },
  openGraph: {
    title: 'Wildwood Retreat | Secluded Eco-Luxury Haven in Morni Hills',
    description:
      'Immerse in private forest villas, stargazing decks, riverside trails, and mountain tranquility at Wildwood Retreat, Morni Hills.',
    url: 'https://forestgatetrails.com/wildwood_retreat',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png',
        width: 1200,
        height: 630,
        alt: 'Wildwood Retreat at The Forest Gate Trails',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

const wildwoodSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. HOTEL / RESORT SCHEMA
    {
      '@type': ['Hotel', 'Resort'],
      '@id': 'https://forestgatetrails.com/wildwood_retreat#resort',
      name: 'Wildwood Retreat at The Forest Gate Trails',
      alternateName: 'Wildwood Eco-Luxury Haven Morni Hills',
      description:
        'A secluded eco-luxury haven of private forest villas, open-sky stargazing decks, riverside trails, and bespoke culinary journeys in Village Tandeo, Morni Hills, Panchkula, Haryana.',
      url: 'https://forestgatetrails.com/wildwood_retreat',
      telephone: '+91 70099 84070',
      priceRange: '₹₹₹',
      image: [
        'https://forestgatetrails.com/assets/images/forestgate-image/YOUR%20SANCTUARY%20IN%20THE%20MOPUNTAINS.png',
        'https://forestgatetrails.com/assets/images/forestgate-image/FORNT%20VIEW%20PROPERTY.png',
        'https://forestgatetrails.com/assets/images/banner.jpeg',
      ],
      starRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      checkinTime: '14:00',
      checkoutTime: '11:00',
      petsAllowed: true,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private Forest Lawn', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Stargazing Deck', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Private Firepit', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Complimentary High-speed Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Organic Mountain Dining', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Guided Nature Trails', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Secured Parking', value: true },
      ],
    },

    // 2. LOCAL BUSINESS / LODGING BUSINESS SCHEMA
    {
      '@type': 'LodgingBusiness',
      '@id': 'https://forestgatetrails.com/#localbusiness',
      name: 'The Forest Gate Trails',
      image: 'https://forestgatetrails.com/assets/images/banner.jpeg',
      telephone: '+91 70099 84070',
      email: 'support@forestgatetrails.com',
      url: 'https://forestgatetrails.com',
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
      openingHoursSpecification: {
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
      paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
      currenciesAccepted: 'INR',
      areaServed: [
        { '@type': 'City', name: 'Panchkula' },
        { '@type': 'City', name: 'Chandigarh' },
        { '@type': 'City', name: 'Mohali' },
        { '@type': 'City', name: 'Delhi NCR' },
      ],
    },

    // 3. HOTEL ROOM / ACCOMMODATION SCHEMA
    {
      '@type': 'HotelRoom',
      '@id': 'https://forestgatetrails.com/wildwood_retreat#accommodation',
      name: 'Wildwood Private Forest Villa & Suites',
      description:
        'Luxury secluded forest cottages and suites featuring private sit-outs, open forest decks, king-size beds, personal firepit, and panoramic Morni Hills valley views.',
      bed: {
        '@type': 'BedDetails',
        numberOfBeds: 1,
        typeOfBed: 'King Bed',
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        minValue: 1,
        maxValue: 4,
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Mountain View Balcony', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Private Bonfire & Firepit', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'En-suite Luxury Bath', value: true },
        { '@type': 'LocationFeatureSpecification', name: '24/7 Room Service', value: true },
      ],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: '6500',
        highPrice: '14500',
        offerCount: '6',
        availability: 'https://schema.org/InStock',
        url: 'https://forestgatetrails.com/booking',
      },
    },

    // 4. FAQPAGE SCHEMA (RICH SNIPPETS)
    {
      '@type': 'FAQPage',
      '@id': 'https://forestgatetrails.com/wildwood_retreat#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What makes Wildwood Retreat different from regular resort stays?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wildwood Retreat is our ultra-exclusive, low-density wilderness enclave at The Forest Gate. It offers total privacy, private firepits, dedicated personal hosts, custom nature trails, and unobstructed mountain vistas, perfect for travelers seeking tranquility away from crowded tourist hubs.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we reach Wildwood Retreat at The Forest Gate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We are situated in Village Tandeo, Morni Hills, Panchkula, Haryana. The route from Chandigarh or Panchkula is smooth, fully paved, and extremely scenic. Private chauffeur and airport transfer services can be arranged upon request.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are pets welcome at Wildwood Retreat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely! We love pets and understand they are part of your family. Our cottages feature private lawns and wide forest trails where your pets can run freely and safely.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the climate like at Wildwood Retreat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Perched over 4,000 feet above sea level, Wildwood enjoys refreshingly cooler temperatures than the surrounding plains year-round. Summer evenings are pleasant and breezy, monsoon brings lush waterfalls and sea-of-clouds mist, and winters are comfortably chilly with crisp blue skies and cozy firepit weather.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can we book Wildwood Retreat for private celebrations or corporate offsites?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the retreat can be booked on an exclusive buyout basis for intimate weddings, wellness retreats, anniversary getaways, or executive leadership offsites. Contact our concierge to customize your itinerary.',
          },
        },
      ],
    },

    // 5. BREADCRUMBLIST SCHEMA
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://forestgatetrails.com/wildwood_retreat#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://forestgatetrails.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Retreats & Sanctuaries',
          item: 'https://forestgatetrails.com/#retreats',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Wildwood Retreat',
          item: 'https://forestgatetrails.com/wildwood_retreat',
        },
      ],
    },

    // 6. AGGREGATERATING & REVIEWS SCHEMA
    {
      '@type': 'AggregateRating',
      '@id': 'https://forestgatetrails.com/wildwood_retreat#rating',
      itemReviewed: {
        '@id': 'https://forestgatetrails.com/wildwood_retreat#resort',
      },
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
    {
      '@type': 'Review',
      itemReviewed: {
        '@id': 'https://forestgatetrails.com/wildwood_retreat#resort',
      },
      author: {
        '@type': 'Person',
        name: 'Rohit Sharma',
      },
      datePublished: '2026-08-14',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'Wildwood Retreat gave us the peace and serenity we were desperately craving. The private cottage, mountain views, and firepit under the stars were pure magic.',
    },
    {
      '@type': 'Review',
      itemReviewed: {
        '@id': 'https://forestgatetrails.com/wildwood_retreat#resort',
      },
      author: {
        '@type': 'Person',
        name: 'Dr. Ananya Verma',
      },
      datePublished: '2026-09-02',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      reviewBody:
        'Easily the most peaceful retreat near Chandigarh and Delhi NCR. Delicious organic food and wonderful pet-friendly open spaces.',
    },
  ],
};

export default function WildwoodRetreatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wildwoodSchema) }}
      />
      <WildwoodClient />
    </>
  );
}