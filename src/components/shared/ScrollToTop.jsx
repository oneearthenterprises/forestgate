'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on admin dashboard
  if (pathname.startsWith('/admin-dashboard')) {
    return null;
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'fixed bottom-24 right-6 z-50 rounded-full  transition-all duration-300 border border-border bg-card text-foreground hover:bg-accent',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}
