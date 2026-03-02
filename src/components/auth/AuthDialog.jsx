'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MountainSnow } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
import { Separator } from '@/components/ui/separator';

const LoginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." })
});

const RegisterFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." })
});

export function AuthDialog({ open, onOpenChange }) {
    const { toast } = useToast();
    const router = useRouter();
    const [mode, setMode] = useState('signup'); // 'login' or 'signup'

    const loginForm = useForm({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: { name: "", email: "", phone: "", password: "" },
    });

    async function onLoginSubmit(data) {
        console.log("Login Data:", data);
        toast({ title: "Login Successful!", description: "Welcome back to The Forest Gate." });
        onOpenChange(false);
        router.push('/my-bookings');
    }

    async function onRegisterSubmit(data) {
        console.log("Register Data:", data);
        toast({ title: "Registration Successful!", description: "Your account has been created." });
        setMode('login');
    }

    const marqueeContent = (
        <div className="flex items-center gap-8 pr-8">
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">System Status</span>
                <div className="flex items-center gap-1.5 text-[#085d6b] text-xs font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#085d6b] animate-pulse" />
                    SECURE CONNECTION
                </div>
            </div>
            <div className="h-8 w-px bg-[#085d6b]/10" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Gateway</span>
                <p className="text-xs font-bold text-[#085d6b]">VERIFIED SSL</p>
            </div>
            <div className="h-8 w-px bg-[#085d6b]/10" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Authentication</span>
                <p className="text-xs font-bold text-[#085d6b]">MULTI-LAYERED</p>
            </div>
            <div className="h-8 w-px bg-[#085d6b]/10" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Encryption</span>
                <p className="text-xs font-bold text-[#085d6b]">AES-256 BIT</p>
            </div>
            <div className="h-8 w-px bg-[#085d6b]/10" />
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl bg-background">
                {/* Scrollable Area with Fixed Height */}
                <div className="h-[600px] overflow-y-auto px-8 pt-6 pb-10 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Integrated Marquee Status Badge */}
                    <div className="w-full bg-[#085d6b]/5 border border-[#085d6b]/10 rounded-2xl p-3 overflow-hidden hidden sm:block">
                        <div className="flex items-center w-full">
                            <div className="relative flex overflow-x-hidden">
                                <motion.div
                                    animate={{ x: ["0%", "-50%"] }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="flex whitespace-nowrap"
                                >
                                    {marqueeContent}
                                    {marqueeContent}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className="flex items-center gap-2 font-bold text-2xl font-headline text-primary">
                            <MountainSnow className="h-10 w-10 text-[#085d6b]" />
                            <span className="text-[#085d6b]">THE FOREST GATE</span>
                        </div>
                    </div>

                    {/* Custom Tabs */}
                    <div className="flex p-1 bg-muted/50 rounded-full">
                        <button 
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'login' ? 'bg-[#085d6b] text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'signup' ? 'bg-[#085d6b] text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Forms */}
                    {mode === 'login' ? (
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="you@example.com" {...field} className="h-12 rounded-xl border-muted bg-muted/20 pl-4 pr-10 focus-visible:ring-[#085d6b]" />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#085d6b]/60">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl border-muted bg-muted/20 px-4 focus-visible:ring-[#085d6b]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-14 rounded-xl bg-[#085d6b] hover:bg-[#064a55] text-white text-base font-bold shadow-lg transition-transform active:scale-[0.98]">
                                    Login Now
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                                <FormField
                                    control={registerForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} className="h-12 rounded-xl border-muted bg-muted/20 px-4 focus-visible:ring-[#085d6b]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="you@example.com" {...field} className="h-12 rounded-xl border-muted bg-muted/20 pl-4 pr-10 focus-visible:ring-[#085d6b]" />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#085d6b]/60">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 987 654 3210" {...field} className="h-12 rounded-xl border-muted bg-muted/20 px-4 focus-visible:ring-[#085d6b]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl border-muted bg-muted/20 px-4 focus-visible:ring-[#085d6b]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-14 rounded-xl bg-[#085d6b] hover:bg-[#064a55] text-white text-base font-bold shadow-lg transition-transform active:scale-[0.98]">
                                    Sign Up
                                </Button>
                            </form>
                        </Form>
                    )}

                    {/* Social Login */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground font-bold">or</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full h-14 rounded-xl border-muted text-foreground font-medium transition-all hover:bg-muted/30">
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center text-[11px] text-muted-foreground leading-relaxed">
                        By continuing, you agree to The Forest Gate's <br/>
                        <a href="#" className="underline font-bold text-foreground">Terms</a> and <a href="#" className="underline font-bold text-foreground">Privacy</a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
