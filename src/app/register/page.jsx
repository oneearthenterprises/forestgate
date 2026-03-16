"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { MountainSnow, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuthContext } from "@/context/AuthContext";

const RegisterFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid 10-digit phone number." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

function RegisterForm() {
  const [step, setStep] = useState("REGISTER");
const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my-bookings";
  const { register, loading, verifyOtpRegister } = useAuthContext();
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === "gallery-pool-1",
  );

  const form = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rememberMe: false,
    },
  });

  // Pre-fill fields from saved booking data
  useEffect(() => {
    const savedData = sessionStorage.getItem("tempBookingData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) form.setValue("name", parsed.fullName);
      if (parsed.email) form.setValue("email", parsed.email);
      if (parsed.phone) form.setValue("phone", parsed.phone);
    }
  }, [form]);

const onRegisterSubmit = async (values) => {
  try {
    await register(values);

    setUserEmail(values.email);
    setStep("VERIFY_OTP_REGISTER");

    toast({
      title: "Registration successful",
      description: "Please verify your email to continue.",
    });

  } catch (err) {
    if (err.message === "OTP verification pending. Please verify your email.") {
      setUserEmail(values.email);
      setStep("VERIFY_OTP_REGISTER");

      toast({
        title: "OTP Pending",
        description: "Please verify your email.",
      });

      return;
    }

    toast({
      title: "Registration failed",
      description: err.message,
      variant: "destructive",
    });

    if (err.message === "User already exists") {
      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 2000);
    }
  }
};



const otpForm = useForm({
  defaultValues: {
    otp: "",
  },
});


// onVerifyOtpRegister otp
const onVerifyOtpRegister = async (values) => {
  try {
    await verifyOtpRegister(userEmail, values.otp);

    toast({
      title: "Email Verified",
      description: "Your account verified successfully.",
    });

    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

  } catch (err) {
    toast({
      title: "Verification Failed",
      description: err.message,
      variant: "destructive",
    });
  }
};

const handleResendOtp = async () => {
  try {
    await resendOtp(userEmail);
    toast({
      title: "Code Resent",
      description: "Please check your email for the new verification code.",
    });
  } catch (err) {
    toast({
      title: "Resend Failed",
      description: err.message,
      variant: "destructive",
    });
  }
};
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* Subtle Textured Background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1200"
          alt="texture"
          fill
          className="object-cover"
        />
      </div>

      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center min-h-screen relative z-10">
        <div className="max-w-md w-full mx-auto flex flex-col h-full py-12">
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold text-muted-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <MountainSnow className="w-4 h-4 text-primary" />
              Return Home
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
           
{step === "REGISTER" && (
  <>
   <h1 className="text-4xl font-headline font-bold mb-2">
              Join the Sanctuary
            </h1>
            <p className="text-muted-foreground mb-8">
              Create an account to begin your journey with us.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onRegisterSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 focus-visible:ring-primary shadow-sm"
                        />
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
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 focus-visible:ring-primary shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 focus-visible:ring-primary shadow-sm"
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
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-4">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-12 rounded-full bg-slate-50 border border-slate-200 px-6 focus-visible:ring-primary shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0 ml-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border border-gray-400 accent-[#fcb101]"
                        />
                      </FormControl>

                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium text-muted-foreground cursor-pointer">
                          Send me booking updates and special offers
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none mt-2"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </Form>
  </>

            )}

            {step === "VERIFY_OTP_REGISTER" && (
              <>
                <h1 className="text-4xl font-headline font-bold mb-2">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground mb-8">
                  Enter the 6-digit code we sent to{" "}
                  <span className="font-bold text-foreground">
                    {userEmail}
                  </span>
                </p>

                <Form {...otpForm}>
                  <form
                    onSubmit={otpForm.handleSubmit(onVerifyOtpRegister)}
                    className="space-y-6"
                  >
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                            Verification Code
                          </FormLabel>
                          <FormControl>
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup className="gap-2 sm:gap-4">
                                <InputOTPSlot
                                  index={0}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                                <InputOTPSlot
                                  index={1}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                                <InputOTPSlot
                                  index={2}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                                <InputOTPSlot
                                  index={3}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                                <InputOTPSlot
                                  index={4}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                                <InputOTPSlot
                                  index={5}
                                  className="h-14 w-12 sm:w-14 rounded-xl border-2 border-slate-200 bg-slate-50 text-xl font-bold"
                                />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage className="mt-4" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-full bg-[#fcb101] hover:bg-[#e0a000] text-black font-bold text-base transition-all active:scale-[0.98] shadow-none mt-2"
                    >
                      Verify Code
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Resend Code
                  </Button>
                </div>
              </>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="text-primary font-bold hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-between text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
            <Link
              href="/rooms"
              className="hover:text-primary transition-colors"
            >
              Our Suites
            </Link>
            <div className="flex gap-4">
              <Link
                href="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Image/Lifestyle */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        <Image
          src={
            heroImage?.imageUrl ||
            "https://images.unsplash.com/photo-1500815845799-7748ca339f27?auto=format&fit=crop&q=80&w=1200"
          }
          alt="Poolside View"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 p-16 flex flex-col justify-end text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#fcb101]" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-wider">
              THE FOREST GATE
            </span>
          </div>
          <h2 className="text-5xl font-headline text-white font-bold leading-tight mb-4">
            Begin Your <br />
            <span className="text-[#fcb101]">Bespoke</span> Adventure.
          </h2>
          <p className="text-white/80 text-lg font-light max-w-md">
            Experience the heights of hospitality. Create your account today to
            unlock exclusive rates and tailored Himalayan itineraries.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}

