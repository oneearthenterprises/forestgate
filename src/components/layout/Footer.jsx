"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MountainSnow, Facebook, Instagram, Twitter } from "lucide-react";
import { navLinks } from "@/app/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { API } from "@/lib/api/api";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const { toast } = useToast();
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  // Hide footer on admin pages, login, or register pages
  if (
    pathname.startsWith("/admin-dashboard") ||
    pathname === "/admin-login" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const footerNavLinks = navLinks.filter(
    (link) =>
      link.label === "About" ||
      link.label === "Rooms" ||
      link.label === "Experiences" ||
      link.label === "Events" ||
      link.label === "Contact",
  );

const submitValue = async (e) => {
  e.preventDefault();

  if (!email) return;

  try {
    const res = await fetch(API.newsletteremail, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    switch (res.status) {
      case 201:
        toast({
          title: "Thanks for Subscribe",
          description: data.message,
        });
        setEmail("");
        break;

      case 409:
        toast({
          title: "Already Subscribed",
          description: data.message,
        });
        break;

      case 400:
        toast({
          title: "Invalid Email",
          description: data.message,
          variant: "destructive",
        });
        break;

      default:
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Please try again later",
      variant: "destructive",
    });
  }
};
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo Section - Always visible */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <img src="/assets/images/forestgatelogo.svg" alt="The Forest Gate" className="h-9 w-auto" />
            </Link>
            <p className="text-foreground/70 font-light leading-relaxed">
              Luxury Meets Nature in the Heart of Himachal. Experience
              sustainable luxury and unparalleled tranquility in our Himalayan
              sanctuary.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                href="https://www.facebook.com/profile.php?id=61588259480467#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/forestgate.retreat/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Mobile View: Accordions */}
          <div className="md:hidden space-y-2 mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="links"
                className="border-b border-border/50"
              >
                <AccordionTrigger className="font-headline font-bold text-xl hover:no-underline py-4">
                  Quick Links
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-4 pb-4">
                    {footerNavLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-foreground/70 hover:text-primary transition-colors text-base font-medium"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/privacy-policy"
                        className="text-foreground/70 hover:text-primary transition-colors text-base font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="contact"
                className="border-b border-border/50"
              >
                <AccordionTrigger className="font-headline font-bold text-xl hover:no-underline py-4">
                  Contact Us
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 pb-4 text-foreground/70 text-base font-medium">
                    <p>
                      Village Naggar, Near Manali, Himachal Pradesh, 175131,
                      India
                    </p>
                    <p>Email: contact@theforestgate.com</p>
                    <p>Phone: +91 987 654 3210</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="newsletter" className="border-none">
                <AccordionTrigger className="font-headline font-bold text-xl hover:no-underline py-4">
                  Newsletter
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-4">
                    <p className="text-foreground/70 text-base font-medium">
                      Sign up for our newsletter to get the latest updates and
                      exclusive offers.
                    </p>
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={submitValue}
                    >
                      <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="bg-background h-14 rounded-2xl border-border/50"
                      />

                      <Button
                        type="submit"
                        className="h-14 rounded-2xl font-bold uppercase tracking-widest text-xs"
                      >
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop View: Standard Columns */}
          <div className="hidden md:block">
            <h3 className="font-headline font-bold text-xl mb-8">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-4">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-foreground/70 hover:text-primary transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="font-headline font-bold text-xl mb-8">Contact Us</h3>
            <div className="flex flex-col gap-4 text-foreground/70 font-medium leading-relaxed">
              <p>
                Village Naggar, <br />
                Near Manali, Himachal Pradesh, <br />
                175131, India
              </p>
              <div className="space-y-1 mt-2">
                <p>Email: contact@theforestgate.com</p>
                <p>Phone: +91 987 654 3210</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <h3 className="font-headline font-bold text-xl mb-8">Newsletter</h3>
            <p className="text-foreground/70 mb-6 font-medium leading-relaxed">
              Stay updated with our latest stories and mountain retreats.
            </p>
            <form className="flex flex-col gap-3" onSubmit={submitValue}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="bg-background h-14 rounded-2xl border-border/50"
              />
              <Button
                type="submit"
                className="h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
              >
                Join Now
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-foreground/40 text-xs font-bold uppercase tracking-[0.1em]">
          <p>
            &copy; {new Date().getFullYear()} The Forest Gate. All Rights
            Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
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
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
