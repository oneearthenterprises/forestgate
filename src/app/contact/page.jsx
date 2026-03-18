'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Phone, Mail, Pin } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LocationMap } from "@/components/shared/LocationMap";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/lib/api/api";


const ContactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactPage() {
    const { toast } = useToast()
    const headerImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');
    const form = useForm({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
           fullName: "",
      email: "",
      message: "",
        },
    });

    function onSubmit(data) {
        try {
             const payload = {
                fullName: data.name,
                email: data.email,
                message: data.message,
             }
            const contactUs = async ()=>{
                const response = await fetch(API.ContactUsPost, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const responseData = await response.json();
                console.log(responseData);
            }
            contactUs();
        } catch (error) {
            console.log(error);
        }


        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        })
        form.reset();
    }

    return (
        <div>
            {headerImage && (
                <PageHeader
                title="Contact Us"
                subtitle="We'd love to hear from you. Get in touch with us."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}

            <section>
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                             <h2 className="font-headline text-3xl font-bold mb-6">Send us a Message</h2>
                             <Card>
                                 <CardContent className="p-6">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="you@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Your Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Tell us how we can help..." {...field} rows={6} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <Button type="submit">Send Message</Button>
                                        </form>
                                    </Form>
                                 </CardContent>
                             </Card>
                        </div>
                        <div className="space-y-8">
                             <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
                             <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold flex items-center gap-2 mb-2"><MapPin className="w-5 h-5 text-primary"/> Address</h3>
                                    <p className="text-foreground/80 ml-7">Village Naggar, <br/>Manali, Himachal Pradesh, 175131, India</p>
                                </div>
                                 <div>
                                    <h3 className="font-bold flex items-center gap-2 mb-2"><Mail className="w-5 h-5 text-primary"/> Email</h3>
                                    <Link href="mailto:contact@theforestgate.com" className="text-foreground/80 hover:text-primary ml-7">contact@theforestgate.com</Link>
                                </div>
                                 <div>
                                    <h3 className="font-bold flex items-center gap-2 mb-2"><Phone className="w-5 h-5 text-primary"/> Phone</h3>
                                    <Link href="tel:+9304987505" className="text-foreground/80 hover:text-primary ml-7">+91 987 654 3210</Link>
                                </div>
                             </div>
                             <div className="flex flex-col gap-4">
                                <Button asChild size="lg">
                                    <Link href="https://wa.me/9304987505" target="_blank">Chat on WhatsApp</Link>
                                </Button>
                                <Button asChild variant="secondary" size="lg">
                                    <Link href="tel:+9304987505">Call Now</Link>
                                </Button>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="pt-0">
                <div className="container mx-auto px-4">
                    <LocationMap />
                    <div className="mt-8 text-center">
                        <h3 className="font-headline text-2xl font-bold mb-4">Nearby Attractions</h3>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-foreground/80">
                            <span>Naggar Castle</span>
                            <span>Roerich Art Gallery</span>
                            <span>Jana Waterfall</span>
                            <span>Solang Valley</span>
                            <span>Old Manali</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
