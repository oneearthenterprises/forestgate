import Image from "next/image";
import Link from 'next/link';
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Heart, Briefcase, PartyPopper, ArrowRight, Sparkles } from "lucide-react";

export default function EventsPage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'gallery-events-1');
    const events = [
        {
            title: "Destination Weddings",
            description: "Exchange vows with a breathtaking mountain backdrop. Our team specializes in creating magical, bespoke weddings that reflect your love story. From intimate ceremonies to grand receptions, we handle every detail with precision and grace.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
            imageHint: "mountain wedding",
            icon: Heart
        },
        {
            title: "Corporate Retreats",
            description: "Inspire innovation and foster team spirit in a serene and stimulating environment. Our resort offers modern meeting facilities, customized team-building activities, and comfortable accommodations for a productive getaway.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
            imageHint: "corporate event",
            icon: Briefcase
        },
        {
            title: "Private Celebrations",
            description: "Celebrate your special moments with us. Whether it's a milestone birthday, an anniversary, or a private gathering, we provide the perfect setting, exquisite catering, and personalized service to make it unforgettable.",
            image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200",
            imageHint: "party celebration",
            icon: PartyPopper
        },
    ];

    return (
        <div className="bg-[#fcfcfc]">
            {headerImage && (
                <PageHeader
                    title="Events & Celebrations"
                    subtitle="Create unforgettable memories in an extraordinary Himalayan setting."
                    imageUrl={headerImage.imageUrl}
                    imageHint={headerImage.imageHint}
                />
            )}

            <section className="overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-24 md:gap-32">
                        {events.map((event, index) => (
                            <div key={event.title} className="relative group">
                                {/* Subtle Background Text/Decorative element */}
                                <div className={`absolute -top-10 hidden lg:block opacity-[0.03] select-none pointer-events-none transition-transform duration-1000 group-hover:translate-x-10 ${index % 2 === 0 ? '-left-20' : '-right-20 text-right'}`}>
                                    <span className="text-[12rem] font-headline font-bold leading-none uppercase">
                                        {event.title.split(' ')[0]}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                                    {/* Image Container */}
                                    <div className={`lg:col-span-8 relative z-0 overflow-hidden rounded-[2.5rem] shadow-2xl ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2 lg:col-start-5'}`}>
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            width={1200}
                                            height={800}
                                            className="object-cover w-full aspect-[16/10] transition-transform duration-700 group-hover:scale-105"
                                            data-ai-hint={event.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Floating Content Box */}
                                    <div className={`relative z-10 mt-[-80px] lg:mt-0 lg:col-span-5 ${index % 2 === 0 ? 'lg:order-2 lg:ml-[-12%]' : 'lg:order-1 lg:mr-[-12%] lg:col-start-1'}`}>
                                        <div className="bg-background/95 backdrop-blur-xl p-8 md:p-12 lg:p-16 rounded-[2rem] shadow-2xl border border-border/50">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl mb-8 shadow-xl shadow-secondary/20">
                                                <event.icon className="w-8 h-8 text-black" />
                                            </div>
                                            <h3 className="font-headline text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                                {event.title}
                                            </h3>
                                            <p className="text-foreground/70 mb-10 text-lg leading-relaxed font-light">
                                                {event.description}
                                            </p>
                                            <Button asChild variant="secondary" className="h-14 px-10 text-base font-bold group shadow-none">
                                                <Link href="/contact" className="flex items-center gap-2">
                                                    Inquire Now
                                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-card py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black uppercase tracking-widest mb-6">
                            <Sparkles className="w-3 h-3" />
                            Elite Venues
                        </div>
                        <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6">Our Venues</h2>
                        <p className="text-lg text-foreground/60 font-light leading-relaxed">
                            Discover a variety of indoor and outdoor spaces meticulously designed to serve as the perfect canvas for your events.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "The Mountain Lawn", img: "venue1", hint: "outdoor venue" },
                            { name: "The Riverside Hall", img: "venue2", hint: "banquet hall" },
                            { name: "The Starlight Terrace", img: "venue3", hint: "terrace party" }
                        ].map((venue, idx) => (
                            <div key={idx} className="group relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
                                <Image 
                                    src={`https://picsum.photos/seed/${venue.img}/600/800`} 
                                    alt={venue.name} 
                                    fill 
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    data-ai-hint={venue.hint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                                    <div className="w-12 h-1 bg-secondary mb-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    <h3 className="font-headline text-3xl font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {venue.name}
                                    </h3>
                                    <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Capacity for up to 200 guests with bespoke arrangements.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Button asChild size="lg" className="h-16 px-12 rounded-full text-lg font-bold bg-[#fcb101] text-black hover:bg-[#e0a000] border-none shadow-none">
                            <Link href="/contact">Plan Your Event With Us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
