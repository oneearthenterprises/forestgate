
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MountainSnow, Facebook, Instagram, Twitter } from 'lucide-react';
import { navLinks } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin-dashboard')) {
    return null;
  }

  const footerNavLinks = navLinks.filter(
    (link) =>
      link.label === 'About' ||
      link.label === 'Rooms' ||
      link.label === 'Experiences' ||
      link.label === 'Events' ||
      link.label === 'Contact'
  );

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
             <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
              <MountainSnow className="h-6 w-6" />
              <span>The Forest Gate</span>
            </Link>
            <p className="text-foreground/80">
              Luxury Meets Nature in the Heart of Himachal.
            </p>
            <div className="flex gap-4 mt-2">
                <Link href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-foreground/80 hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 text-foreground/80 hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-foreground/80 hover:text-primary transition-colors" /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy-policy" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-2 text-foreground/80">
              <p>Village Naggar, Near Manali, Himachal Pradesh, India</p>
              <p>Email: contact@theforestgate.com</p>
              <p>Phone: +91 987 654 3210</p>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-foreground/80 mb-4">
              Sign up for our newsletter to get the latest updates and offers.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} The Forest Gate. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
