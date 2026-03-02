
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { testimonials } from "@/app/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { PlayCircle, Quote } from "lucide-react"

export function Testimonials() {
    return (
        <section id="testimonials" className="bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-bold mb-2 tracking-widest uppercase text-sm">Guest Stories</p>
                    <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">
                        Real People, Unforgettable Stays
                    </h2>
                    <p className="text-lg text-foreground/70">
                        Discover why our guests choose Himachal Haven for their mountain retreats.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden bg-card">
                            {testimonial.image && (
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={testimonial.image}
                                        alt={`Testimonial from ${testimonial.name}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="portrait outdoor"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                    />
                                    {testimonial.video && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                                                <PlayCircle className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <CardContent className="flex-1 flex flex-col p-8">
                                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                                <blockquote className="flex-1">
                                    <p className="text-lg text-foreground/80 mb-8 italic leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>
                                </blockquote>
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} />
                                        <AvatarFallback className="bg-primary/5 text-primary">{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-base">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
      </section>
    )
}
