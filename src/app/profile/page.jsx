"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import { API } from "@/lib/api/api";

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
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, User, Trash2, Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().optional(),
  dob: z.string().optional(),
  anniversaryDate: z.string().optional(),
  occupation: z.enum(["Business Owner", "Salaried", ""]).optional(),
  companyName: z.string().optional(),
corporatePartyOptions: z.boolean().optional(),
});

function ProfileForm() {
  const { toast } = useToast();
  const { userToken, adminToken, setUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const token = userToken || adminToken;

  const form = useForm({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      dob: "",
      anniversaryDate: "",
      occupation: "",
      companyName: "",
    corporatePartyOptions: false,
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
          dob: data.user.dob || "",
          anniversaryDate: data.user.anniversaryDate || "",
          occupation: data.user.occupation || "",
          companyName: data.user.companyName || "",
          corporatePartyOptions: data.user.corporatePartyOptions || false,
        });
        if (data.user.profileImage) {
          setImagePreview(data.user.profileImage);
        }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      formData.append("address", data.address || "");

      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // Add new fields to formData
      formData.append("dob", data.dob || "");
      formData.append("anniversaryDate", data.anniversaryDate || "");
      formData.append("occupation", data.occupation || "");
      formData.append("companyName", data.companyName || "");
      formData.append("corporatePartyOptions", data.corporatePartyOptions);

      const res = await fetch(API.updateProfile, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        // Update local preview and GLOBAL state
        if (result.user) {
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
          setImagePreview(result.user.profileImage);
          setImageFile(null);
          toast({
            title: "Success",
            description: "Profile updated successfully!",
          });
        }
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
          <p className="text-muted-foreground">
            Please log in to view and manage your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-6 p-8 border-b bg-white/50">
        <div className="relative group">
          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl bg-white relative overflow-hidden">
            <AvatarImage src={imagePreview} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary font-bold text-2xl">
              {form.getValues("name")?.substring(0, 2).toUpperCase() || (
                <User className="h-10 w-10 text-primary/30" />
              )}
            </AvatarFallback>

            <label
              htmlFor="profile-upload"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-8 w-8 text-white" />
            </label>
          </Avatar>

          {imageFile && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-lg"
              onClick={() => {
                setImageFile(null);
                fetchProfile(); // Reset to original
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            My Profile
          </CardTitle>
          <CardDescription className="text-base">
            Update your personal information and preferences.
          </CardDescription>
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
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 border-gray-200 focus:border-primary focus:ring-1"
                        placeholder="Enter your full name"
                        {...field}
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
                    <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 border-gray-200 focus:border-primary focus:ring-1"
                        placeholder="+91 000 000 0000"
                        {...field}
                      />
                    </FormControl>
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
                  <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 border-gray-200"
                      readOnly
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Email cannot be changed for security reasons.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[100px] border-gray-200 focus:border-primary focus:ring-1"
                      placeholder="Enter your delivery or residence address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Discount Section */}
            <div className="pt-8 border-t">
              <h3 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
                <Star className="h-5 w-5 fill-primary/20" />
                Special Discount / Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            className="h-12 border-gray-200 focus:border-primary focus:ring-1 pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anniversaryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Anniversary Date
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            className="h-12 border-gray-200 focus:border-primary focus:ring-1 pr-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Occupation
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 bg-white">
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Business Owner">
                            Business Owner
                          </SelectItem>
                          <SelectItem value="Salaried">Salaried</SelectItem>
                        </SelectContent>
                      </Select>

                      {field.value === "Salaried" && (
                        <div className="mt-2 text-xs font-medium text-primary">
                          <p>• Corporate Party booking eligible.</p>
                          <p className="mt-1 text-muted-foreground">
                            If salaried user books a corporate party, next visit
                            gets 10% discount.
                          </p>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("occupation") === "Business Owner" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Company Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              className="h-12 border-gray-200 focus:border-primary focus:ring-1"
                              placeholder="Enter your company name"
                              {...field}
                            />
                          </FormControl>

                          <div className="mt-2 text-xs font-bold text-primary italic">
                            "Welcome to Corporate Party"
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Checkbox */}
                  <FormField
  control={form.control}
  name="corporatePartyOptions"
  render={({ field }) => (
    <FormItem>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
        <p className="text-muted-foreground">
          Want to choose corporate party
        </p>
      </label>

      <FormMessage />
    </FormItem>
  )}
/>
                
                  </div>
                )}
              </div>
            </div>

            <div className="flex pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto px-12 h-12 text-base font-semibold shadow-md"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Saving changes..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function FormDescription({ children, className }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export default function ProfilePage() {
  const headerImage = PlaceHolderImages.find(
    (img) => img.id === "about-resort",
  );

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
