'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MountainSnow, Mail, X } from "lucide-react";
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
        toast({ title: "Login Successful!", description: "Welcome back to The Forest Gate." });
        onOpenChange(false);
        router.push('/my-bookings');
    }

    async function onRegisterSubmit(data) {
        toast({ title: "Registration Successful!", description: "Your account has been created." });
        setMode('login');
    }

    const marqueeContent = (
        <div className="flex items-center gap-8 pr-8">
            <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Status</span>
                <div className="flex items-center gap-1.5 text-[#085d6b] text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    CONNECTION
                </div>
            </div>
            <div className="h-6 w-px bg-[#085d6b]/10" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Gateway</span>
                <p className="text-[10px] font-bold text-[#085d6b]">VERIFIED SSL</p>
            </div>
            <div className="h-6 w-px bg-[#085d6b]/10" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">Authentication</span>
                <p className="text-[10px] font-bold text-[#085d6b]">MULTI-LAYERED</p>
            </div>
            <div className="h-6 w-px bg-[#085d6b]/10" />
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
                <div className="max-h-[90vh] overflow-y-auto px-8 pt-12 pb-10 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
                    
                    {/* Light Green Marquee Status */}
                    <div className="w-full bg-[#effaf3] border border-green-100 rounded-2xl p-3 overflow-hidden">
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

                    {/* Branding */}
                    <div className="flex flex-col items-center gap-2 w-full pt-4">
                        <div className="flex items-center gap-3 font-bold text-2xl font-headline text-[#085d6b]">
                            <MountainSnow className="h-10 w-10" />
                            <span className="tracking-tight uppercase">THE FOREST GATE</span>
                        </div>
                    </div>

                    {/* Mode Toggle Tabs */}
                    <div className="flex p-1 bg-slate-50 rounded-full max-w-[320px] mx-auto border border-slate-100 shadow-inner relative h-16 items-center">
                        <button 
                            onClick={() => setMode('login')}
                            className={`flex-1 h-full rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 ${mode === 'login' ? 'text-white' : 'text-slate-400'}`}
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => setMode('signup')}
                            className={`flex-1 h-full rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 z-10 ${mode === 'signup' ? 'text-white' : 'text-slate-400'}`}
                        >
                            Sign up
                        </button>
                        <motion.div 
                            layoutId="auth-toggle"
                            initial={false}
                            animate={{ x: mode === 'login' ? '0%' : '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-[#085d6b] rounded-full shadow-lg"
                        />
                    </div>

                    {/* Dynamic Forms */}
                    <div className="pt-2">
                        {mode === 'login' ? (
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-8">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="admin@theforestgate.com" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#085d6b]/20">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-black text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-secondary/20 transition-all active:scale-[0.98] mt-4">
                                        Login Now
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-8">
                                    <FormField
                                        control={registerForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="admin@theforestgate.com" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#085d6b]/20">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91 987 654 3210" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-3">Create Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-6 focus-visible:ring-[#085d6b]/20 font-medium placeholder:text-slate-300 shadow-sm" />
                                                </FormControl>
                                                <FormMessage className="ml-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-black text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-secondary/20 transition-all active:scale-[0.98] mt-4">
                                        Sign Up
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>

                    {/* Social Authentication */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="bg-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
                                <span className="bg-white px-4 text-slate-300">or continue with</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 text-slate-600 font-bold transition-all hover:bg-slate-50 shadow-sm border-2">
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </Button>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center text-[9px] text-slate-300 leading-relaxed font-bold pt-4 uppercase tracking-widest">
                        By continuing, you agree to <br/>
                        The Forest Gate's <a href="#" className="underline text-slate-400 hover:text-[#085d6b]">Terms</a> & <a href="#" className="underline text-slate-400 hover:text-[#085d6b]">Privacy Policy</a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
