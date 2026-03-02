'use client';

import React from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { usePathname } from 'next/navigation';

export function WhatsAppButton() {
  const pathname = usePathname();

  // Don't show the WhatsApp button on admin dashboard pages
  if (pathname.startsWith('/admin-dashboard')) {
    return null;
  }

  const handleSubmit = (event, message) => {
    console.log('WhatsApp message sent:', message);
  };

  return (
    <FloatingWhatsApp
      phoneNumber="+919876543210"
      accountName="Himachal Haven"
      statusMessage="Online"
      chatMessage="Hello! 👋 How can we help you plan your Himalayan getaway today?"
      placeholder="Type a message..."
      notification={true}
      notificationDelay={30}
      notificationSound={true}
      darkMode={false}
      allowClickAway={true}
      allowEsc={true}
      onSubmit={handleSubmit}
      buttonStyle={{ backgroundColor: '#22c55e' }}
      chatboxStyle={{ borderRadius: '20px' }}
      avatar="https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?w=100&h=100&fit=crop"
    />
  );
}
