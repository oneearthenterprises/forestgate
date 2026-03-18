'use client';

import React, { useState, useEffect } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();
  const [hasAutoClicked, setHasAutoClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Update visibility
      if (scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Auto-click at 200px
      if (scrollY > 200 && !hasAutoClicked) {
        const whatsappButton = document.querySelector('.floating-whatsapp-button');
        if (whatsappButton) {
          whatsappButton.click();
          setHasAutoClicked(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAutoClicked]);

  // Don't show the WhatsApp button on admin dashboard pages
  if (pathname.startsWith('/admin-dashboard')) {
    return null;
  }

  const handleSubmit = (event, message) => {
    console.log('WhatsApp message sent:', message);
  };

  return (
    <div className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <FloatingWhatsApp
        phoneNumber="+9304987505"
        accountName="The Forest Gate"
        statusMessage="Online"
        chatMessage="Hello! 👋 How can we help you plan your Himalayan getaway today?"
        placeholder="Type a message..."
        notification={true}
        notificationDelay={30}
        notificationSound={true}
        darkMode={false}
        allowClickAway={false}
        allowEsc={true}
        onSubmit={handleSubmit}
        buttonStyle={{ backgroundColor: '#22c55e' }}
        chatboxStyle={{ borderRadius: '20px' }}
        avatar="https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?w=100&h=100&fit=crop"
      />
    </div>
  );
}
