'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, MountainSnow, CircleUser, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { navLinks } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { AuthDialog } from '@/components/auth/AuthDialog';

export function Header() {
  const pathname = usePathname();
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  if (pathname.startsWith('/admin-dashboard')) {
    return null;
  }

  const headerNavLinks = navLinks.filter((link) => link.label !== 'Events');

  const headerClasses = cn(
    'fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b shadow-sm text-foreground'
  );
  
  const linkClasses = (href) => cn(
    'transition-colors font-medium hover:text-primary',
    pathname === href ? 'text-primary' : 'text-foreground'
  );

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
                <MountainSnow className="h-6 w-6" />
                <span>The Forest Gate</span>
              </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {headerNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 hidden md:flex items-center justify-end gap-4">
            <Button asChild>
              <Link href="/booking">Book Now</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/my-bookings">My Bookings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin-dashboard" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsAuthOpen(true)}>Login / Sign Up</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex-1 flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card p-0 flex flex-col">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="p-6 border-b">
                     <SheetClose asChild>
                      <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
                          <MountainSnow className="h-6 w-6" />
                          <span>The Forest Gate</span>
                          </Link>
                      </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-6 p-6 flex-1 text-foreground">
                    {headerNavLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-lg font-medium transition-colors',
                             pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-6 mt-auto border-t">
                      <SheetClose asChild>
                          <Button onClick={() => setIsAuthOpen(true)} variant="outline" className="w-full">
                              Login / Sign Up
                          </Button>
                      </SheetClose>
                      <SheetClose asChild>
                          <Button asChild className="w-full mt-4">
                              <Link href="/booking">Book Now</Link>
                          </Button>
                      </SheetClose>
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </>
  );
}
