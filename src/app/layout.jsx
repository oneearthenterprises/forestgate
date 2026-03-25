import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import './globals.css';
import './react-calendar.css';
import { AuthContextProvider } from '@/context/AuthContext';
import { ReCaptchaProvider } from '@/components/providers/ReCaptchaProvider';
export const metadata = {
  metadataBase: new URL('https://theforestgate.com'),
  title: {
    default: 'The Forest Gate - Luxury Meets Nature in the Heart of Himachal',
    template: '%s | The Forest Gate',
  },
  description:
    'Discover The Forest Gate, a luxury resort offering a unique blend of nature, adventure, and tranquility in Naggar, Manali. Perfect for families, couples, and corporate retreats.',
  keywords: [
    'The Forest Gate',
    'Luxury Resort Himachal',
    'Naggar Manali Resort',
    'Sustainable Luxury Manali',
    'Best Resort for Families Manali',
    'Adventure Resort Himachal',
    'Luxury Cottage Manali',
    'Himachal Tourism',
    'Himalayan Sanctuary',
    'Naggar View Resort',
    'Luxury Stay Himachal'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Forest Gate - Luxury Himalayan Resort',
    description: 'Experience tranquility and sustainable luxury at The Forest Gate, Naggar, Manali.',
    url: 'https://theforestgate.com',
    siteName: 'The Forest Gate',
    images: [
      {
        url: '/assets/images/banner.jpeg',
        width: 1200,
        height: 630,
        alt: 'The Forest Gate Resort',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Forest Gate - Luxury Himalayan Resort',
    description: 'Experience tranquility and sustainable luxury at The Forest Gate, Naggar, Manali.',
    images: ['/assets/images/banner.jpeg'],
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Playfair+Display:wght@400;500;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          <ReCaptchaProvider>
            <AuthContextProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
              <Toaster />
            </AuthContextProvider>
          </ReCaptchaProvider>
      </body>
    </html>
  );
}
