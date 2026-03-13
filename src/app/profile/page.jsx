'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { API } from "@/lib/api/api";

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().optional(),
});


function ProfileForm() {
    const { toast } = useToast();
    const { userToken, adminToken } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const token = userToken || adminToken;

    const form = useForm({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
    });

    const fetchProfile = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(API.getProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.user) {
                form.reset({
                    name: data.user.name || "",
                    phone: data.user.phone?.toString() || "",
                    email: data.user.email || "",
                    address: data.user.address || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [token]);

    async function onSubmit(data) {
        try {
            const res = await fetch(API.updateProfile, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (res.ok) {
                toast({
                    title: "Profile Updated!",
                    description: "Your profile information has been updated successfully.",
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: result.message || "Something went wrong.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        }
    }
    
    if (loading) {
        return (
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        );
    }

    if (!token) {
        return (
            <Card className="text-center py-10">
                <CardContent>
                    <p className="text-muted-foreground">Please log in to view and manage your profile.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-6 p-8 border-b bg-white/50">
                 <Avatar className="h-20 w-20 border-2 border-primary/20 p-1 bg-white">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${form.getValues('name')}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {form.getValues('name')?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">My Profile</CardTitle>
                    <CardDescription className="text-base">Update your personal information and preferences.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField 
                                control={form.control} 
                                name="name" 
                                render={({ field }) => ( 
                                    <FormItem> 
                                        <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</FormLabel> 
                                        <FormControl><Input className="h-12 border-gray-200 focus:border-primary focus:ring-1" placeholder="Enter your full name" {...field} /></FormControl> 
                                        <FormMessage /> 
                                    </FormItem> 
                                )} 
                            />
                            <FormField 
                                control={form.control} 
                                name="phone" 
                                render={({ field }) => ( 
                                    <FormItem> 
                                        <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mobile Number</FormLabel> 
                                        <FormControl><Input className="h-12 border-gray-200 focus:border-primary focus:ring-1" placeholder="+91 000 000 0000" {...field} /></FormControl> 
                                        <FormMessage /> 
                                    </FormItem> 
                                )} 
                            />
                        </div>
                        
                        <FormField 
                            control={form.control} 
                            name="email" 
                            render={({ field }) => ( 
                                <FormItem> 
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel> 
                                    <FormControl><Input className="h-12 border-gray-200" readOnly disabled {...field} /></FormControl> 
                                    <FormDescription className="text-xs">Email cannot be changed for security reasons.</FormDescription>
                                    <FormMessage /> 
                                </FormItem> 
                            )} 
                        />

                        <FormField 
                            control={form.control} 
                            name="address" 
                            render={({ field }) => ( 
                                <FormItem> 
                                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Address</FormLabel> 
                                    <FormControl><Textarea className="min-h-[100px] border-gray-200 focus:border-primary focus:ring-1" placeholder="Enter your delivery or residence address" {...field} /></FormControl> 
                                    <FormMessage /> 
                                </FormItem> 
                            )} 
                        />

                        <div className="flex pt-4">
                            <Button type="submit" size="lg" className="w-full md:w-auto px-12 h-12 text-base font-semibold shadow-md" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving changes..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function FormDescription({children, className}) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}

export default function ProfilePage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'about-resort');
    
    return (
        <div className="min-h-screen bg-muted/30">
            {headerImage && (
                <PageHeader
                title="My Profile"
                subtitle="Manage your account details and preferences."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}

            <section className="py-12 md:py-20 -mt-16 relative z-10">
                <div className="container mx-auto px-4 max-w-3xl">
                   <ProfileForm />
                </div>
            </section>
        </div>
    );
}
