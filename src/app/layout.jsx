import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import './globals.css';
import './react-calendar.css';

export const metadata = {
  title: 'Himachal Haven - Luxury Meets Nature in the Heart of Himachal',
  description:
    'Discover Himachal Haven, a luxury resort offering a unique blend of nature, adventure, and tranquility. Perfect for families, couples, and corporate retreats.',
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Lato:wght@400;700&display=swap"
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
