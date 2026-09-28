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
    // 1. ORGANIZATION
    {
      '@type': 'Organization',
      name: 'The Forest Gate',
      alternateName: 'The Forest Gate Trails',
      url: 'https://forestgatetrails.com/',
      logo: 'https://forestgatetrails.com/assets/images/forestgatelogo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+917009984070',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
      sameAs: [
        'https://www.facebook.com/profile.php?id=61588259480467#',
        'https://www.instagram.com/forestgate.retreat/?hl=en',
      ],
    },

    // 2. RESORT
    {
      '@type': 'Resort',
      name: 'The Forest Gate',
      url: 'https://forestgatetrails.com/',
      image: 'https://forestgatetrails.com/assets/images/banner.jpeg',
      telephone: '+917009984070',
      priceRange: '₹₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Village Tandeo, Morni Hills',
        addressLocality: 'Panchkula',
        addressRegion: 'Haryana',
        postalCode: '134205',
        addressCountry: 'IN',
      },
    },

    // 3. WEBSITE
    {
      '@type': 'WebSite',
      name: 'The Forest Gate',
      url: 'https://forestgatetrails.com/',
    },

    // 4. SITELINKS (SITE NAVIGATION)
    {
      '@type': 'ItemList',
      name: 'Main Sitelinks',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Contact Us',
          description: 'Get in touch with The Forest Gate in Village Tandeo, Morni Hills for bookings, directions, and inquiries.',
          url: 'https://forestgatetrails.com/contact',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Luxury Rooms & Suites',
          description: 'Explore our private suites and luxury cottages nestled in Morni Hills with mountain views.',
          url: 'https://forestgatetrails.com/rooms',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'About Us',
          description: 'Learn about the vision, story, and sustainable luxury philosophy of The Forest Gate.',
          url: 'https://forestgatetrails.com/about',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Experiences & Activities',
          description: 'Guided nature trails, riverbed safaris, stargazing decks, bonfires, and mountain adventure.',
          url: 'https://forestgatetrails.com/experiences',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Resort Amenities',
          description: 'Scenic swimming pool with mountain view, open-sky dining, mini cinema, and private lawns.',
          url: 'https://forestgatetrails.com/amenities',
        },
      ],
    },

    // 5. FAQPAGE
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the check-in and check-out times?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Check-in time is 2:00 PM and check-out time is 11:00 AM.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the resort pet-friendly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, The Forest Gate is a pet-friendly resort.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is the resort located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Forest Gate is located in Village Tandeo, Morni Hills, Panchkula, Haryana.',
          },
        },
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
