'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/app/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';

// Updated schema to allow base64 strings or URLs
const BlogFormSchema = z.object({
  title: z.string().min(5, 'Title is required.'),
  excerpt: z.string().min(10, 'Excerpt is required.'),
  content: z.string().min(20, 'Content is required.'),
  author: z.string().min(2, 'Author name is required.'),
  category: z.string().min(2, 'Category is required.'),
  imageUrl: z.string().min(1, 'Featured image is required.'),
});

const defaultFormValues = {
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: 'Local Guide',
    imageUrl: '',
};

export default function AdminBlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState(blogPosts);
  const [editingPost, setEditingPost] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (editingPost) {
      const getImageUrl = (imageIdentifier) => {
        if (!imageIdentifier) return '';
        if (imageIdentifier.startsWith('http') || imageIdentifier.startsWith('data:image')) {
            return imageIdentifier;
        }
        const placeholder = PlaceHolderImages.find(img => img.id === imageIdentifier);
        return placeholder ? placeholder.imageUrl : '';
      }

      form.reset({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        author: editingPost.author,
        category: editingPost.category,
        imageUrl: getImageUrl(editingPost.image),
      });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      form.reset(defaultFormValues);
    }
  }, [editingPost, form]);

  function onSubmit(data) {
    if (editingPost) {
      const updatedPost = {
          ...editingPost,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          category: data.category,
          image: data.imageUrl,
      };
      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
      toast({
        title: 'Post Updated',
        description: `"${data.title}" has been successfully updated.`,
      });
      setEditingPost(null);
    } else {
      const newPost = {
          id: 'blog-' + Math.random().toString(36).substring(2, 7),
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          category: data.category,
          date: format(new Date(), 'MMMM dd, yyyy'),
          image: data.imageUrl,
      };
      setPosts(prev => [newPost, ...prev]);
      toast({
        title: 'Post Created',
        description: `"${data.title}" has been successfully published.`,
      });
    }
    form.reset(defaultFormValues);
  }

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast({
      title: 'Post Deleted',
      description: `The blog post has been removed.`,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          form.setValue('imageUrl', reader.result, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '', { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Manage Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {editingPost ? <Edit className="w-5 h-5 text-primary" /> : <PlusCircle className="w-5 h-5 text-primary" />}
                    {editingPost ? 'Edit Post' : 'New Post'}
                </CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                            <Input placeholder="Post Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Excerpt</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Brief summary..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Content</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Write your story..." {...field} rows={8} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex justify-between items-center">
                                Featured Image
                                {field.value && (
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveImage}
                                        className="text-xs text-destructive hover:underline"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </FormLabel>
                            <div className="space-y-4">
                                {field.value ? (
                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-muted group">
                                        <Image src={field.value} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button 
                                                type="button" 
                                                variant="destructive" 
                                                size="sm" 
                                                className="rounded-full"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                    >
                                        <div className="bg-background p-3 rounded-full shadow-sm mb-2">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <span className="text-sm font-bold">Upload Featured Image</span>
                                        <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">PNG, JPG or WebP</span>
                                    </button>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    accept="image/*" 
                                />
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="flex items-center gap-2 pt-4">
                         <Button type="submit" className="flex-1 font-bold">
                            {editingPost ? 'Save Changes' : 'Publish Post'}
                        </Button>
                        {editingPost && (
                            <Button type="button" variant="outline" onClick={() => setEditingPost(null)}>
                                Cancel
                            </Button>
                        )}
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-headline">Published Posts</h2>
             {posts.length === 0 ? (
                 <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                     <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                     <p className="text-muted-foreground">No blog posts found. Create your first one!</p>
                 </div>
             ) : (
                posts.map((post) => {
                    const postImg = (() => {
                        if (!post.image) return null;
                        if (post.image.startsWith('http') || post.image.startsWith('data:image')) return post.image;
                        const placeholder = PlaceHolderImages.find(img => img.id === post.image);
                        return placeholder ? placeholder.imageUrl : null;
                    })();

                    return (
                        <Card key={post.id} className="flex flex-col md:flex-row overflow-hidden rounded-3xl border-none shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="relative md:w-1/3 aspect-video md:aspect-auto min-h-[200px]">
                                {postImg ? (
                                    <Image src={postImg} alt={post.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{post.category}</p>
                                        <h3 className="font-bold text-xl leading-tight hover:text-primary transition-colors cursor-default">{post.title}</h3>
                                    </div>
                                    <div className="text-right text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                        <p>{post.date}</p>
                                        <p className="text-foreground">By {post.author}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-light">{post.excerpt}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-full px-4 h-9" onClick={() => setEditingPost(post)}>
                                        <Edit className="mr-2 h-3.5 w-3.5" /> 
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" className="rounded-full px-4 h-9" onClick={() => handleDelete(post.id)}>
                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> 
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )
                })
             )}
        </div>
      </div>
    </div>
  );
}
