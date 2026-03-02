
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function PrivacyBanner() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'banner-privacy')?.imageUrl || "https://picsum.photos/seed/privacy/1920/1080";
  const shapeImage = PlaceHolderImages.find(img => img.id === 'shape-torn')?.imageUrl || "https://picsum.photos/seed/torn/1920/200";

  return (
    <section
      className="relative h-[75vh] flex items-center justify-center text-center text-white bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Dark Gradient Overlay using the brand-inspired dark color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b2c3d]/90 via-[#0b2c3d]/80 to-[#0b2c3d]/70 z-10"></div>

      {/* Content */}
      <div className="relative z-20 px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-wide uppercase">
          PRIVACY POLICY
        </h1>

        <div className="mt-4 text-sm md:text-base font-medium">
          <Link href="/" className="text-secondary hover:underline">Home</Link>
          <span className="mx-2 text-white/70">|</span>
          <span className="text-white">Privacy Policy</span>
        </div>
      </div>

      {/* Torn Shape Layer */}
      <div className="absolute bottom-0 left-0 w-full z-20 h-24 overflow-hidden">
        <Image
          src={shapeImage}
          alt="shape layer"
          width={1920}
          height={200}
          className="w-full h-full object-cover opacity-90"
          priority
          data-ai-hint="paper texture"
        />
      </div>
    </section>
  );
}
