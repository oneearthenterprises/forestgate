
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * ManagedBySection - A reusable banner component for management attribution.
 * 
 * @param {string} label - The small cursive label (e.g., "Managed By").
 * @param {string} title - The main bold heading.
 * @param {string} description - The subtitle text.
 * @param {string} buttonText - Text for the CTA button.
 * @param {string} buttonLink - Destination for the CTA button.
 * @param {string} imageSrc - URL for the decorative side image.
 * @param {string} imageAlt - Alt text for the decorative image.
 */
export function ManagedBySection({ 
  label = "Managed By", 
  title = "The Morni Hills Forest Development Authority", 
  description = "Authorized Eco-Tourism Partner dedicated to sustainable luxury and nature preservation in the heart of Haryana Pradesh.",
  buttonText = "Contact Us",
  buttonLink = "/contact",
  imageSrc = "/assets/images/bannerpecock.png",
  imageAlt = "Lush Forest"
}) {

  const subTitleStyle = {
    color: '#ffae3e',
    fontFamily: '"Kaushan Script", cursive',
    fontSize: '32px',
    fontWeight: '400',
  };

  return (
    <section className="relative bg-[#70ac43] py-20 md:py-24  overflow-hidden">

    <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
      <div className="max-w-3xl space-y-6">
  
        <div className="space-y-2">
          <p style={subTitleStyle}>{label}</p>
  
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-headline">
            {title}
          </h2>
        </div>
  
        <div className="space-y-6 pt-4">
          <p className="text-white text-base md:text-lg font-light opacity-90 font-body leading-relaxed max-w-2xl">
            {description}
          </p>
  
          <Button
            asChild
            className="bg-white text-black hover:bg-white/90 rounded-2xl px-10 h-14 shadow-none font-bold text-base"
          >
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
  
      </div>
    </div>
  
    {/* Peacock */}
    <div
      className="
        absolute
        right-0
        bottom-0
        top-0
        z-0
        pointer-events-none
        flex items-center
        w-[380px]
        sm:w-[380px] 
        md:w-[340px]
        lg:w-[365px]
        xl:w-[365px]
      "
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={500}
        height={900}
        priority
        className="w-full h-auto object-contain"
      />
    </div>
  
  </section>
  );
}
