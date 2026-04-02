"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Mail, Lock, CheckCircle2, MountainSnow, Eye, EyeOff } from "lucide-react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { API } from "@/lib/api/api";
const EmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const OtpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits." }),
});

const ResetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'exp-stargazing');

  const [step, setStep] = useState("REQUEST_OTP");
  const [userEmail, setUserEmail] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

const onRequestOtp = async (values) => {
  try {
    const res = await fetch(API.forgotPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setUserEmail(values.email);
    setStep("VERIFY_OTP");

    toast({
      title: "Code Sent",
      description: data.message,
    });

  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

const onVerifyOtp = async (values) => {
  try {
    const res = await fetch(API.verifyOtp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        otp: values.otp,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setStep("RESET_PASSWORD");

    toast({
      title: "OTP Verified",
      description: data.message,
    });

  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

const onResetPassword = async (values) => {
  try {
    const res = await fetch(API.resetPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        newPassword: values.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast({
      title: "Success",
      description: data.message,
    });

    router.push("/login");

  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

 const handleResendOtp = async () => {
  try {
    const res = await fetch(API.resendOtp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast({
      title: "OTP Resent",
      description: data.message,
    });

  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1200"
          alt="texture"
          fill
          className="object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center min-h-screen relative z-10">
        <div className="max-w-md w-full mx-auto flex flex-col h-full py-12">
          <div className="mb-12">
            <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold text-muted-foreground bg-muted/30 hover:bg-muted/50 transition-colors">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Back to Login
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {step === "REQUEST_OTP" && (
              <>
                <h1 className="text-4xl font-headline font-bold mb-2">Reset Password</h1>
                <p className="text-muted-foreground mb-8">Enter your email address and we'll send you a 6-digit code to reset your password.</p>

                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onRequestOtp)} className="space-y-6">
                    <FormField 
                      control={emailForm.control} 
                      name="email" 
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Email address</FormLabel> 
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="you@example.com" 
                                {...field} 
                                className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 pl-12 focus-visible:ring-primary shadow-sm"
                              />
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                          </FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none"
                      disabled={emailForm.formState.isSubmitting}
                    >
                      {emailForm.formState.isSubmitting ? 'Sending Code...' : 'Send Verification Code'}
                      {!emailForm.formState.isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {step === "VERIFY_OTP" && (
              <>
                <h1 className="text-4xl font-headline font-bold mb-2">Check Your Email</h1>
                <p className="text-muted-foreground mb-8">We've sent a verification code to <span className="font-bold text-slate-900">{userEmail}</span>. Enter it below.</p>

                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-8 flex flex-col items-center">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup className="gap-2 sm:gap-4">
                                <InputOTPSlot index={0} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                                <InputOTPSlot index={1} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                                <InputOTPSlot index={2} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                                <InputOTPSlot index={3} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                                <InputOTPSlot index={4} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                                <InputOTPSlot index={5} className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold" />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none"
                      disabled={otpForm.formState.isSubmitting}
                    >
                      {otpForm.formState.isSubmitting ? 'Verifying...' : 'Verify Code'}
                    </Button>
                    
                    <button 
                      type="button"
                      onClick={handleResendOtp}
                      className="text-xs font-black uppercase tracking-[0.2em] text-primary hover:underline"
                    >
                      Didn't receive the code? Resend
                    </button>
                  </form>
                </Form>
              </>
            )}

            {step === "RESET_PASSWORD" && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <h1 className="text-4xl font-headline font-bold leading-tight">Identity Verified</h1>
                </div>
                <p className="text-muted-foreground mb-8">Verification complete. Please choose a new, secure password for your sanctuary account.</p>

                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-6">
                    <FormField 
                      control={resetForm.control} 
                      name="password" 
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">New Password</FormLabel> 
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showNewPw ? "text" : "password"}
                                placeholder="••••••••" 
                                {...field} 
                                className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 pl-12 pr-12 focus-visible:ring-primary shadow-sm"
                              />
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />
                    <FormField 
                      control={resetForm.control} 
                      name="confirmPassword" 
                      render={({ field }) => ( 
                        <FormItem> 
                          <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Confirm Password</FormLabel> 
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPw ? "text" : "password"}
                                placeholder="••••••••" 
                                {...field} 
                                className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 pl-12 pr-12 focus-visible:ring-primary shadow-sm"
                              />
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl> 
                          <FormMessage /> 
                        </FormItem> 
                      )} 
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none"
                      disabled={resetForm.formState.isSubmitting}
                    >
                      {resetForm.formState.isSubmitting ? 'Updating...' : 'Set New Password'}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>

          <div className="mt-12 flex justify-between text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Return to site</Link>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        <Image 
          src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?auto=format&fit=crop&q=80&w=1200"}
          alt="Sanctuary Stargazing"
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
          <h2 className="text-5xl font-headline text-white font-bold leading-tight mb-4">
            Safety First in the <br/>
            <span className="text-[#fcb101]">Morni Hills</span> Wilderness.
          </h2>
          <p className="text-white/80 text-lg font-light max-w-md">
            We take your security seriously. Use our multi-step verification to safely reclaim access to your private sanctuary profile.
          </p>
        </div>
      </div>
    </div>
  );
}
