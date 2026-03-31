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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { API } from '@/lib/api/api';

const BlogFormSchema = z.object({
  title: z.string().min(5, 'Title is required.'),
  content: z.string().min(20, 'Content is required.'),
  author: z.string().min(2, 'Author name is required.'),
  category: z.string().min(2, 'Category is required.'),
  shortDescription: z.string().min(10, 'Short description is required.'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.string().min(1, 'Featured image is required.'),
});

const defaultFormValues = {
    title: '',
    content: '',
    author: 'Admin',
    category: 'Local Guide',
    shortDescription: '',
    metaTitle: '',
    metaDescription: '',
    image: '',
};

export default function AdminBlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: defaultFormValues,
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API.getBlogs);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error fetching blogs', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editingPost) {
      form.reset({
        title: editingPost.title || '',
        content: editingPost.content || '',
        author: editingPost.author || 'Admin',
        category: editingPost.category || 'Local Guide',
        shortDescription: editingPost.shortDescription || '',
        metaTitle: editingPost.metaTitle || '',
        metaDescription: editingPost.metaDescription || '',
        image: editingPost.image || '',
      });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      form.reset(defaultFormValues);
    }
  }, [editingPost, form]);

  async function onSubmit(data) {
    try {
      if (editingPost) {
        const res = await fetch(API.updateBlog(editingPost._id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast({ title: 'Post Updated', description: `"${data.title}" updated successfully.` });
          setEditingPost(null);
          fetchBlogs();
        } else {
            toast({ title: 'Error', variant: 'destructive', description: "Failed to update blog." });
        }
      } else {
        const res = await fetch(API.createBlog, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast({ title: 'Post Published', description: `"${data.title}" published successfully.` });
          fetchBlogs();
        } else {
            toast({ title: 'Error', variant: 'destructive', description: "Failed to create blog." });
        }
      }
      form.reset(defaultFormValues);
    } catch (err) {
      console.error(err);
      toast({ title: 'Network Error', variant: 'destructive' });
    }
  }

  const handleDelete = async (postId) => {
    try {
        const res = await fetch(API.deleteBlog(postId), { method: 'DELETE' });
        if (res.ok) {
            toast({ title: 'Post Deleted', description: 'The blog post has been removed.' });
            fetchBlogs();
        }
    } catch (err) {
        console.error(err);
        toast({ title: 'Error deleting blog', variant: 'destructive' });
    }
  };

  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size to prevent 413 Payload Too Large on simple save
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: 'File too large', description: 'Please use an image under 2MB.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          form.setValue(fieldName, reader.result, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (fieldName) => {
    form.setValue(fieldName, '', { shouldValidate: true });
  };

  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Manage Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
            <Card className="rounded-[2rem] border-none shadow-lg bg-card border border-slate-100">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
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
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</FormLabel>
                            <FormControl>
                            <Input placeholder="Post Title" {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
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
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</FormLabel>
                                <FormControl>
                                <Input {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
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
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</FormLabel>
                                <FormControl>
                                <Input {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Brief summary..." {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
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
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Content</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Write your story... (HTML supported)" {...field} rows={6} className="rounded-xl border-slate-100 bg-slate-50/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* SEO Block */}
                    <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100 mt-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">SEO Optimization</h4>
                        <FormField
                            control={form.control}
                            name="metaTitle"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Title</FormLabel>
                                <FormControl>
                                <Input placeholder="SEO Title..." {...field} className="rounded-xl bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="metaDescription"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description</FormLabel>
                                <FormControl>
                                <Textarea placeholder="SEO Description..." {...field} rows={2} className="rounded-xl bg-white" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mt-4">
                                Featured Image
                                {field.value && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage('image')}
                                        className="text-[9px] text-destructive font-black hover:underline"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </FormLabel>
                            <div className="space-y-4">
                                {field.value ? (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/50 group">
                                        <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="sm" className="rounded-full" onClick={() => handleRemoveImage('image')}>
                                                <X className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                    >
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-2 border border-slate-100">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <span className="text-xs font-bold">Upload Featured Image</span>
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'image')} className="hidden" accept="image/*" />
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="flex items-center gap-2 pt-4">
                         <Button type="submit" className="flex-1 h-14 rounded-2xl bg-[#085d6b] hover:bg-[#06424d] text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98]">
                            {editingPost ? 'Save Changes' : 'Publish Post'}
                        </Button>
                        {editingPost && (
                            <Button type="button" variant="outline" className="h-14 rounded-2xl px-6 border-slate-200 text-slate-400 font-bold" onClick={() => setEditingPost(null)}>
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
                 <div className="p-12 text-center border border-dashed rounded-[2.5rem] bg-card/50">
                     <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                     <p className="text-slate-400 font-medium">No blog posts found. Create your first one!</p>
                 </div>
             ) : (
                posts.map((post) => {
                    return (
                        <Card key={post._id} className="flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white group">
                            <div className="md:w-[40%] relative shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                        <ImageIcon className="w-12 h-12 text-slate-200" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center border-l border-slate-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#085d6b]">{post.category}</p>
                                        <h3 className="font-bold text-2xl lg:text-3xl leading-tight text-slate-900 font-headline">{post.title}</h3>
                                    </div>
                                    <div className="hidden sm:block text-right text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] shrink-0 ml-4">
                                        <p>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
                                        <p className="text-slate-900/40">By {post.author}</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-base mb-8 font-light leading-relaxed line-clamp-3">
                                    {post.shortDescription}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-full px-8 h-11 border-2 font-black uppercase tracking-widest text-[10px]" 
                                        onClick={() => setEditingPost(post)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" /> 
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        className="rounded-full px-8 h-11 font-black uppercase tracking-widest text-[10px] shadow-none" 
                                        onClick={() => handleDelete(post._id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> 
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
