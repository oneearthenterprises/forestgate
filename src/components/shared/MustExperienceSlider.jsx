'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Default items if none are passed via props (featuring the 6 retreats)
export const DEFAULT_EXPERIENCE_ITEMS = [
  {
    title: 'The Forest Retreat',
    description: 'Secluded luxury mountain sanctuary perched high above the clouds with private stone firepits.',
    image: '/assets/images/forestgate-image/YOUR SANCTUARY IN THE MOPUNTAINS.png',
    href: '/the-forest-retreat',
    badge: 'Flagship Sanctuary',
    elevation: '4,350 Ft.',
  },
  {
    title: 'Forest Haven',
    description: 'Eco-luxury forest villas with 60+ Himalayan bird species and private creek-side paths.',
    image: '/assets/images/forestgate-image/PROPERTTY.png',
    href: '/forest-haven',
    badge: 'Eco-Luxury',
    elevation: '4,280 Ft.',
  },
  {
    title: 'Whispering Woods',
    description: 'Canopy treehouses hovering 30 feet above the forest floor with starlight skylights.',
    image: '/assets/images/forestgate-image/FORNT VIEW PROPERTY.png',
    href: '/whispering-woods',
    badge: 'Treehouses',
    elevation: '4,410 Ft.',
  },
  {
    title: 'Wildwood Retreat',
    description: 'Low-density wilderness enclave with riverside trails and open-sky starlight cinema.',
    image: '/assets/images/forestgate-image/RIVER VIEW.jpeg',
    href: '/wildwood_retreat',
    badge: 'Wilderness Luxury',
    elevation: '4,200 Ft.',
  },
  {
    title: 'Nature’s Gate',
    description: 'Mountain gateway and trekking hub with cliffside pool sunsets and river bouldering.',
    image: '/assets/images/forestgate-image/TREKKING.png',
    href: '/natures-gate',
    badge: 'Adventure',
    elevation: '4,150 Ft.',
  },
  {
    title: 'The Green Escape',
    description: 'Emerald valley hideaway dedicated to organic farm-to-fork dining and digital detox.',
    image: '/assets/images/forestgate-image/Open Sky Dining.png',
    href: '/the-green-escape',
    badge: 'Verdant Valley',
    elevation: '4,300 Ft.',
  },
];

/**
 * MustExperienceSlider
 * 
 * Reusable luxury slider inspired by premier tourism destinations (Abu Dhabi Tourism style).
 * Props:
 * - title: Section heading (default: "Must-do experiences")
 * - description: Subtitle text below the title
 * - items: Array of { title, description, image, href, badge }
 * - wide: Boolean to enable wide full-bleed container styling (default: true)
 * - className: Custom container classes
 * - layout: 'bento' (1 tall, 2 stacked, 1 tall...) | 'uniform' (all cards equal)
 */
export function MustExperienceSlider({
  title = 'Must-do experiences',
  description = "These essential Forest Gate sanctuaries and experiences belong on every visitor's list. Don't leave without ticking off these unforgettable moments.",
  items = DEFAULT_EXPERIENCE_ITEMS,
  wide = true,
  layout = 'bento',
  className = '',
  showControls = true,
}) {
  const scrollContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Check scroll state
  const checkScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, items]);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = Math.max(scrollContainerRef.current.clientWidth * 0.75, 380);
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Group items into Bento columns:
  // Col 0: 1 tall
  // Col 1: 2 stacked
  // Col 2: 1 tall
  // Col 3: 2 stacked ...
  const bentoColumns = React.useMemo(() => {
    if (layout !== 'bento') return null;

    const cols = [];
    let i = 0;
    let isTallNext = true;

    while (i < items.length) {
      if (isTallNext) {
        cols.push({
          type: 'tall',
          items: [items[i]],
        });
        i += 1;
        isTallNext = false;
      } else {
        // Grab up to 2 items for stacked column
        const stackItems = items.slice(i, i + 2);
        cols.push({
          type: 'stacked',
          items: stackItems,
        });
        i += stackItems.length;
        isTallNext = true;
      }
    }
    return cols;
  }, [items, layout]);

  return (
    <section className={`py-12 md:py-18 bg-white text-slate-900 ${className}`}>
      {/* Section Header */}
      <div
        className={`${
          wide
            ? 'w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20'
            : 'container mx-auto px-4'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-950 font-headline leading-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-3 md:mt-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {description}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          {showControls && (
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous experiences"
                className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm active:scale-95'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next experiences"
                className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'bg-slate-900 hover:bg-slate-800 text-white  active:scale-95'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slider Scroll Area */}
      <div
        ref={scrollContainerRef}
        className={`w-full overflow-x-auto scrollbar-none scroll-smooth pb-4 select-none ${
          wide
            ? 'px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20'
            : 'container mx-auto px-4'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {layout === 'bento' && bentoColumns ? (
          /* BENTO LAYOUT (Matches Abu Dhabi Tourism screenshot exactly) */
          <div className="flex gap-4 md:gap-5 w-max">
            {bentoColumns.map((col, colIdx) => {
              if (col.type === 'tall') {
                const item = col.items[0];
                if (!item) return null;
                const CardWrapper = item.href ? Link : 'div';

                return (
                  <div
                    key={`tall-${colIdx}`}
                    className="w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-[480px] sm:h-[520px] md:h-[580px] shrink-0"
                  >
                    <CardWrapper
                      href={item.href || '#'}
                      className="block w-full h-full relative rounded-[28px] sm:rounded-[32px] md:rounded-[38px] overflow-hidden group  hover: transition-all duration-500"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, 420px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Subtle Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                      {/* Optional Badge */}
                      {item.badge && (
                        <div className="absolute top-5 left-5 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                            {item.badge}
                          </span>
                        </div>
                      )}

                      {/* Bottom Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                        <h3 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-snug drop-">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="mt-2 text-white/80 text-xs sm:text-sm line-clamp-2 font-light leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all">
                          <span>Explore Experience</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardWrapper>
                  </div>
                );
              }

              // Stacked column with 2 cards
              return (
                <div
                  key={`stacked-${colIdx}`}
                  className="w-[300px] sm:w-[380px] md:w-[460px] lg:w-[520px] h-[480px] sm:h-[520px] md:h-[580px] shrink-0 flex flex-col gap-4 md:gap-5"
                >
                  {col.items.map((item, itemIdx) => {
                    const CardWrapper = item.href ? Link : 'div';
                    return (
                      <div key={itemIdx} className="flex-1 h-[calc(50%-8px)] md:h-[calc(50%-10px)]">
                        <CardWrapper
                          href={item.href || '#'}
                          className="block w-full h-full relative rounded-[28px] sm:rounded-[32px] md:rounded-[38px] overflow-hidden group  hover: transition-all duration-500"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 300px, (max-width: 768px) 420px, 520px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                          {/* Optional Badge */}
                          {item.badge && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                                {item.badge}
                              </span>
                            </div>
                          )}

                          {/* Bottom Text Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug drop-">
                              {item.title}
                            </h3>

                            {item.description && (
                              <p className="mt-1 text-white/80 text-xs sm:text-sm line-clamp-1 font-light leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </CardWrapper>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* UNIFORM CARD LAYOUT */
          <div className="flex gap-4 md:gap-5 w-max">
            {items.map((item, idx) => {
              const CardWrapper = item.href ? Link : 'div';
              return (
                <div
                  key={idx}
                  className="w-[280px] sm:w-[320px] md:w-[380px] h-[460px] sm:h-[500px] shrink-0"
                >
                  <CardWrapper
                    href={item.href || '#'}
                    className="block w-full h-full relative rounded-[28px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden group  hover: transition-all duration-500"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 280px, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1.5 text-xs text-white/80 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardWrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile-only swipe indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 md:hidden text-xs text-slate-400 font-medium">
        <span>← Swipe to explore all experiences →</span>
      </div>
    </section>
  );
}
