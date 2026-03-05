import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import './globals.css';
import './react-calendar.css';

export const metadata = {
  title: 'The Forest Gate - Luxury Meets Nature in the Heart of Himachal',
  description:
    'Discover The Forest Gate, a luxury resort offering a unique blend of nature, adventure, and tranquility. Perfect for families, couples, and corporate retreats.',
  openGraph: {
    title: 'The Forest Gate - Luxury Himalayan Resort',
    description: 'Experience tranquility and sustainable luxury at The Forest Gate, Naggar, Manali.',
    url: 'https://theforestgate.com',
    siteName: 'The Forest Gate',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?auto=format&fit=crop&q=80&w=1200&h=630',
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
    images: ['https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?auto=format&fit=crop&q=80&w=1200&h=630'],
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&family=Kaushan+Script&family=Playfair+Display:wght@400;500;700&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
      </body>
    </html>
  );
}
