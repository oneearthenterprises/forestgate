'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/app/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils";

export function Testimonials() {
    const sectionLabelStyle = {
        color: '#ffae3e',
        fontFamily: '"Kaushan Script", cursive',
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: '400',
        textAlign: 'left',
        lineHeight: 'normal',
    };

    return (
        <section id="testimonials" className="bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mb-16">
                    <p className="mb-2" style={sectionLabelStyle}>Guest Reviews</p>
                    <h2 className="text-3xl md:text-5xl mb-4" style={{ fontFamily: "'Sour Gummy', system-ui" }}>
                        What Our Guests Say
                    </h2>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="h-full border border-border shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
                                        <CardContent className="p-6">
                                            {/* Header with Avatar, Name, and Google Branding */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-border">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} />
                                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-bold text-sm leading-none">{testimonial.name}</p>
                                                            <span className="text-[10px] text-muted-foreground">•</span>
                                                            <p className="text-[10px] text-muted-foreground">{testimonial.timeAgo}</p>
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star 
                                                                    key={i} 
                                                                    className={cn(
                                                                        "w-3 h-3",
                                                                        i < (testimonial.stars || 5) ? "text-yellow-400 fill-yellow-400" : "text-muted border-muted"
                                                                    )} 
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded border border-border">
                                                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-[#4285F4]">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                    <span className="text-[10px] font-medium text-muted-foreground">Google</span>
                                                </div>
                                            </div>

                                            {/* Review Body */}
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm leading-tight text-foreground">
                                                    {testimonial.summary}
                                                </p>
                                                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                                                    {testimonial.quote}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-8 gap-2">
                             <div className="flex items-center gap-1">
                                {testimonials.map((_, i) => (
                                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-yellow-400" : "bg-muted-foreground/30")} />
                                ))}
                             </div>
                        </div>
                        <div className="hidden lg:block">
                            <CarouselPrevious className="-left-12 h-10 w-10 shadow-sm" />
                            <CarouselNext className="-right-12 h-10 w-10 shadow-sm" />
                        </div>
                    </Carousel>
                </div>
            </div>
      </section>
    )
}
