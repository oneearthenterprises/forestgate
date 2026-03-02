'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { MountainSnow, Shield } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

    const form = useForm({
        resolver: zodResolver(AdminLoginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onLoginSubmit(data) {
        // Condition bypassed as requested to allow login
        document.cookie = "admin-auth=true; path=/; max-age=86400;"; 
        toast({ title: "Login Successful!", description: "Welcome, Admin." });
        router.push('/admin-dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
             <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 font-bold text-2xl font-headline text-primary">
                        <MountainSnow className="h-8 w-8" />
                        <span>Himachal Haven</span>
                    </div>
                </div>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <Shield className="h-6 w-6" />
                            Admin Panel Login
                        </CardTitle>
                        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
                                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Password</FormLabel> <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
             </div>
        </div>
    );
}
