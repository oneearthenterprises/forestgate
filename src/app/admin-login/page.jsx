'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { MountainSnow, ArrowRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const AdminLoginFormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters."
    })
});

export default function AdminLoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const heroImage = PlaceHolderImages.find(img => img.id === 'about-resort');

    const form = useForm({
        resolver: zodResolver(AdminLoginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onLoginSubmit(data) {
        // Condition bypassed as requested to allow login
        document.cookie = "admin-auth=true; path=/; max-age=86400;"; 
        toast({ title: "Login Successful!", description: "Welcome back to the Admin Dashboard." });
        router.push('/admin-dashboard');
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Login Form (50%) */}
            <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center min-h-screen">
                <div className="max-w-md w-full mx-auto flex flex-col h-full py-12">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold text-muted-foreground bg-muted/30">
                            <Shield className="w-4 h-4" />
                            Admin Gateway
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-4xl font-headline font-bold mb-2">Admin Login</h1>
                        <p className="text-muted-foreground mb-8">Access the management portal for The Forest Gate.</p>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
                                <FormField 
                                    control={form.control} 
                                    name="email" 
                                    render={({ field }) => ( 
                                        <FormItem> 
                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-4">Email address</FormLabel> 
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="admin@theforestgate.com" 
                                                    {...field} 
                                                    className="h-12 rounded-full bg-muted/30 border-none px-6 focus-visible:ring-primary shadow-none"
                                                />
                                            </FormControl> 
                                            <FormMessage /> 
                                        </FormItem> 
                                    )} 
                                />
                                <FormField 
                                    control={form.control} 
                                    name="password" 
                                    render={({ field }) => ( 
                                        <FormItem> 
                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground ml-4">Password</FormLabel> 
                                            <FormControl>
                                                <Input 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    {...field} 
                                                    className="h-12 rounded-full bg-muted/30 border-none px-6 focus-visible:ring-primary shadow-none"
                                                />
                                            </FormControl> 
                                            <FormMessage /> 
                                        </FormItem> 
                                    )} 
                                />
                                
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'Verifying...' : 'Sign In'}
                                    {!form.formState.isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    <div className="mt-12 flex justify-between text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
                        <Link href="/" className="hover:text-primary transition-colors">Return to site</Link>
                        <div className="flex gap-4">
                            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Image/Lifestyle (50%) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-primary">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/20 via-transparent to-black/60" />
                <Image 
                    src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1540346941493-3f8d5d87e169?auto=format&fit=crop&q=80&w=1200"}
                    alt="Resort View"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 p-16 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <MountainSnow className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-headline text-2xl font-bold tracking-wider">THE FOREST GATE</span>
                    </div>
                    <h2 className="text-5xl font-headline font-bold leading-tight mb-4">
                        Excellence in <br/>
                        <span className="text-[#fcb101]">Himalayan</span> Hospitality.
                    </h2>
                    <p className="text-white/80 text-lg font-light max-w-md">
                        Manage your sanctuary with precision. Our admin portal provides all the tools needed to deliver unforgettable guest experiences.
                    </p>
                </div>
            </div>
        </div>
    );
}
