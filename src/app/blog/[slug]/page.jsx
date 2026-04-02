import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Calendar, User, Tag, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { API } from '@/lib/api/api';

async function getPost(slug) {
  try {
    const res = await fetch(API.getBlogBySlug(slug), { next: { revalidate: 10 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getRecentPosts(currentSlug) {
  try {
     const res = await fetch(API.getBlogs, { next: { revalidate: 10 } });
     if (!res.ok) return [];
     const allPosts = await res.json();
     return allPosts.filter(p => p.slug !== currentSlug).slice(0, 3);
  } catch(error) {
     return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found - Forest Gate',
    };
  }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.shortDescription,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.shortDescription,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const recentPosts = await getRecentPosts(params.slug);

  return (
    <article className="bg-[#fcfcfc]">
      <PageHeader
        title={post.title}
        imageUrl={post.image || '/assets/images/gallery-nature-1.jpg'}
        breadcrumbLabel="Blog Post"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-start">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="bg-card rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-xl border border-border/50">
                {post.image && (
                  <div className="relative aspect-[16/9] mb-10 overflow-hidden rounded-[2rem] shadow-lg bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      style={post.blurImage ? { backgroundImage: `url(${post.blurImage})`, backgroundSize: 'cover' } : {}}
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest mb-10 pb-8 border-b border-dashed">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>By {post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full border-none px-3">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div 
                   className="prose prose-stone lg:prose-xl max-w-none prose-headings:font-headline prose-p:font-light prose-p:text-foreground/80 prose-p:leading-relaxed whitespace-pre-line"
                   dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Separator className="my-12" />

                <div className="flex justify-between items-center">
                  <Button asChild variant="outline" className="rounded-full h-12 px-8">
                    <Link href="/blog" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Blog
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 sticky top-32 space-y-12 self-start">
              <div className="bg-card rounded-[2rem] p-8 shadow-lg border border-border/50">
                <h3 className="font-headline text-2xl font-bold mb-8">Recent Stories</h3>
                <div className="space-y-8">
                  {recentPosts.length === 0 ? (
                      <p className="text-sm text-slate-400">No other stories found.</p>
                  ) : recentPosts.map((recent) => {
                    return (
                      <Link key={recent.slug} href={`/blog/${recent.slug}`} className="group flex items-center gap-4">
                        <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                          {recent.image ? (
                            <img
                              src={recent.image}
                              alt={recent.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                <ImageIcon className="w-8 h-8 text-slate-200" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{recent.category}</p>
                          <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {recent.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#085d6b] rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                <h3 className="font-headline text-3xl font-bold mb-4 relative z-10">Visit Our Sanctuary</h3>
                <p className="text-white/80 font-light mb-8 relative z-10">
                  Ready to experience the magic of the Morni Hills for yourself?
                </p>
                <Button asChild variant="secondary" className="w-full h-12 rounded-full font-bold relative z-10 shadow-none text-black bg-white hover:bg-slate-100">
                  <Link href="/booking">Book Your Stay</Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
