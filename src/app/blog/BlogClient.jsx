'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { PageHeader } from '@/components/shared/PageHeader';
import { blogPosts } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, ArrowRight, Mail } from 'lucide-react';
import { API } from '@/lib/api/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function BlogClient() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [email, setEmail] = useState("");
  const headerImage = PlaceHolderImages.find((img) => img.id === 'gallery-nature-1');

  useEffect(() => {
    fetch(API.getBlogs)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch blogs:", err);
        setIsLoading(false);
      });
  }, []);

  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch(API.newsletteremail, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      switch (res.status) {
        case 201:
          toast({ title: "Thanks for Subscribing!", description: data.message });
          setEmail("");
          router.push("/thanks");
          break;
        case 409:
          toast({ title: "Already Subscribed", description: data.message });
          break;
        case 400:
          toast({ title: "Invalid Email", description: data.message, variant: "destructive" });
          break;
        default:
          toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Please try again later", variant: "destructive" });
    }
  };

  const BlogSkeleton = () => (
    <Card className="overflow-hidden border-none shadow-lg rounded-[2rem] bg-card h-full flex flex-col">
      {/* Image Area */}
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      
      <CardHeader className="pt-8 px-8 pb-4 space-y-4">
        {/* Meta Metadata Row */}
        <div className="flex gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        {/* Title Lines */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8 flex-1 space-y-3">
        {/* Excerpt Lines */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-0 mt-auto">
        <Skeleton className="h-4 w-32 rounded-full" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="bg-[#fcfcfc]">
      {headerImage && (
        <PageHeader
          title="Our Blog"
          subtitle="Insights, Guides, and Stories from the Heart of the Morni Hills."
          imageUrl={headerImage.imageUrl}
          breadcrumbLabel="Blog"
        />
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Show 6 skeletons while loading
              [...Array(6)].map((_, i) => <BlogSkeleton key={i} />)
            ) : blogs.length === 0 ? (
                <div className="col-span-full py-16 flex flex-col items-center justify-center">
                    <div className="bg-[#085d6b] rounded-[2.5rem] p-12 lg:p-16 text-center text-white w-full max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />
                        
                        <Mail className="w-16 h-16 mx-auto mb-6 text-white/90" />
                        <h3 className="font-headline text-3xl md:text-5xl font-bold mb-6 relative z-10">More stories coming soon!</h3>
                        <p className="text-white/80 font-light text-lg mb-10 max-w-xl mx-auto relative z-10">
                            Stay tuned. Sign up for our newsletter to get notified when new insights and stories from the Morni Hills are published.
                        </p>
                        
                        <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 rounded-2xl flex-1 focus-visible:ring-white/30"
                                required
                            />
                            <Button
                                type="submit"
                                className="h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-white text-[#085d6b] hover:bg-slate-100 shadow-xl transition-all hover:-translate-y-1"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            ) : (
              blogs.map((post) => {
                return (
                  <Card key={post._id} className="group overflow-hidden border-none shadow-lg rounded-[2rem] bg-card hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                      {post.image && (
                         <img
                           src={post.image}
                           alt={post.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           style={post.blurImage ? { backgroundImage: `url(${post.blurImage})`, backgroundSize: 'cover' } : {}}
                         />
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-secondary text-secondary-foreground font-bold px-4 py-1 rounded-full border-none shadow-md">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pt-8 px-8 pb-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <h3 className="font-headline text-2xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 flex-1">
                      <p className="text-foreground/60 text-sm leading-relaxed line-clamp-3 font-light">
                        {post.shortDescription}
                      </p>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 pt-0 mt-auto">
                      <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80 font-bold text-sm group/btn">
                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                          Read Full Story
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
