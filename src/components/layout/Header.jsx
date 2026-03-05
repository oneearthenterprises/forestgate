'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, MountainSnow, User, BarChart3, LifeBuoy, Settings, LogOut, Shield } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/AuthContext';

export function Header() {
  const { user, logout, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  // Hide header on admin pages, login, or register pages
  if (
    pathname.startsWith('/admin-dashboard') || 
    pathname === '/admin-login' || 
    pathname === '/login' || 
    pathname === '/register'
  ) {
    return null;
  }

  const headerNavLinks = navLinks.filter((link) => link.label !== 'Events');

  const headerClasses = cn(
    'fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b shadow-sm text-foreground'
  );
  
  const linkClasses = (href) => cn(
    'transition-colors font-medium hover:text-primary',
    pathname === href ? 'text-primary font-bold' : 'text-foreground'
  );

  const handleLogout = async () => {
    await logout();
    if(!loading){
      router.push("/login");
    }
  };

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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {headerNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 hidden lg:flex items-center justify-end gap-4">
            <Button asChild className="rounded-full font-bold px-6">
              <Link href="/booking">Book Now</Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all outline-none">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-[1.5rem] border-slate-100 shadow-2xl">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate leading-none">{user.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 truncate">{user.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="mx-2" />
                  <div className="py-1">
                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer group">
                      <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer group">
                      <Link href="/my-bookings" className="flex items-center w-full">
                        <BarChart3 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer group">
                      <Link href="/contact" className="flex items-center w-full">
                        <LifeBuoy className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">Help Center</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="mx-2" />
                    <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer group">
                      <Link href="/admin-dashboard" className="flex items-center w-full">
                        <Shield className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="mx-2" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-10 px-3 cursor-pointer group text-destructive focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-sm font-bold">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild className="rounded-full h-10 px-4 font-bold text-sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Tablet/Mobile Menu Trigger */}
          <div className="lg:hidden flex-1 flex justify-end gap-2">
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
                             pathname === link.href ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-6 mt-auto border-t">
                      {user ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                              <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <SheetClose asChild>
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                            </Button>
                          </SheetClose>
                          <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <SheetClose asChild>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/login">Login / Sign Up</Link>
                            </Button>
                        </SheetClose>
                      )}
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
    </>
  );
}