'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, MountainSnow, User, BarChart3, LifeBuoy, Settings, LogOut, Shield, Instagram, Heart, Eye, MessageCircle, Check, Star } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 flex items-center justify-center z-[60]">
                  <div className="w-6 h-5 flex flex-col justify-between items-center relative transition-all duration-300">
                    <span className={cn(
                      "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center",
                      isMobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                    )} />
                    <span className={cn(
                      "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
                      isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                    )} />
                    <span className={cn(
                      "block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center",
                      isMobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                    )} />
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full h-screen bg-card p-0 flex flex-col border-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="p-6 border-b flex items-center h-16">
                     <SheetClose asChild>
                      <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
                          <MountainSnow className="h-6 w-6" />
                          <span>The Forest Gate</span>
                          </Link>
                      </SheetClose>
                  </div>
                  <nav className="flex flex-col gap-6 p-10 flex-1 text-foreground overflow-y-auto items-start justify-start text-left [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                    {headerNavLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            'text-3xl font-headline font-bold transition-all hover:translate-x-2',
                             pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}

                    {/* Instagram Follow Card */}
                    <div className="mt-10 w-full max-w-sm bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#0b2c3d] flex items-center justify-center shrink-0 shadow-lg">
                                    <Instagram className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-base text-slate-900">theforestgate</h4>
                                        <div className="bg-orange-100 p-1 rounded-lg">
                                            <Star className="w-3 h-3 text-orange-600 fill-current" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold">
                                        <div className="flex items-center gap-1.5">
                                            <Heart className="w-3.5 h-3.5" />
                                            <span>120k</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-[#085d6b]" />
                                            <span>12.5M</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span>5.2K</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-blue-500 hover:bg-slate-50 transition-all">
                                <Check className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="mt-5 text-[11px] text-slate-400 font-medium leading-relaxed">
                            Experience the magic of Himachal through our lens. <br/>
                            Daily updates, guest stories, and exclusive offers.
                        </p>
                    </div>
                  </nav>
                  <div className="p-8 mt-auto border-t bg-muted/10 flex flex-col items-center">
                      {user ? (
                        <div className="space-y-4 w-full max-w-xs">
                          <div className="flex items-center gap-3 mb-4 justify-center">
                            <Avatar className="h-12 w-12 border shadow-sm">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                              <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="text-sm font-bold">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <SheetClose asChild>
                            <Button variant="outline" className="w-full h-12 rounded-full justify-center" asChild>
                              <Link href="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                            </Button>
                          </SheetClose>
                          <Button variant="destructive" className="w-full h-12 rounded-full" onClick={handleLogout}>
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full max-w-xs space-y-4">
                            <SheetClose asChild>
                                <Button asChild variant="outline" className="w-full h-12 rounded-full border-2">
                                    <Link href="/login">Login / Sign Up</Link>
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button asChild className="w-full h-12 rounded-full font-black uppercase tracking-widest text-xs">
                                    <Link href="/booking">Book Your Stay</Link>
                                </Button>
                            </SheetClose>
                        </div>
                      )}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
