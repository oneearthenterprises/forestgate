'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { rooms } from '@/app/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Plus, Video, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const RoomFormSchema = z.object({
  name: z.string().min(3, 'Room name is required.'),
  description: z.string().min(10, 'Short description is required.'),
  longDescription: z.string().min(20, 'Long description is required.'),
  price: z.coerce.number().min(1000, 'Price must be at least 1000.'),
  amenities: z.array(z.string()).min(1, 'Please list at least one amenity.'),
  images: z.array(z.object({ url: z.string().url({ message: "Please enter a valid URL." }) })).min(1, 'Please provide at least one image URL.'),
  videos: z.array(z.object({ url: z.string().url({ message: "Please enter a valid URL." }) })).optional(),
});

const defaultFormValues = {
    name: '',
    description: '',
    longDescription: '',
    price: 10000,
    amenities: ['Wi-Fi', 'Room Service'],
    images: [],
    videos: [],
};

export default function AdminRoomsPage() {
  const { toast } = useToast();
  const [roomList, setRoomList] = useState(rooms);
  const [editingRoom, setEditingRoom] = useState(null);
  const [amenityInput, setAmenityInput] = useState('');
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const formRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (editingRoom) {
      const getImageUrl = (imageIdentifier) => {
        if (!imageIdentifier) return '';
        if (imageIdentifier.startsWith('http') || imageIdentifier.startsWith('data:image')) {
            return imageIdentifier;
        }
        const placeholder = PlaceHolderImages.find(img => img.id === imageIdentifier);
        return placeholder ? placeholder.imageUrl : '';
      }

      form.reset({
        name: editingRoom.name,
        description: editingRoom.description,
        longDescription: editingRoom.longDescription,
        price: editingRoom.price,
        amenities: editingRoom.amenities.map(a => a.name),
        images: editingRoom.images.map(idOrUrl => ({ url: getImageUrl(idOrUrl) })).filter(img => img.url),
        videos: editingRoom.videos?.map(url => ({ url })) || [],
      });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      form.reset(defaultFormValues);
    }
  }, [editingRoom, form]);


  const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
    control: form.control,
    name: "amenities"
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
      control: form.control,
      name: "videos"
  });

  function onSubmit(data) {
    if (editingRoom) {
      // Update existing room
      const updatedRoom = {
          ...editingRoom,
          name: data.name,
          description: data.description,
          longDescription: data.longDescription,
          price: data.price,
          amenities: data.amenities.map(amenity => ({ name: amenity })),
          images: data.images.map(img => img.url),
          videos: data.videos?.map(vid => vid.url) || [],
      };
      setRoomList(prevRooms => prevRooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
      toast({
        title: 'Room Updated',
        description: `The room "${data.name}" has been successfully updated.`,
      });
      setEditingRoom(null);
    } else {
      // Add new room
      const newRoom = {
          id: data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
          name: data.name,
          description: data.description,
          longDescription: data.longDescription,
          price: data.price,
          amenities: data.amenities.map(amenity => ({ name: amenity })),
          images: data.images.map(img => img.url),
          videos: data.videos?.map(vid => vid.url) || [],
      };
      setRoomList(prevRooms => [newRoom, ...prevRooms]);
      toast({
        title: 'Room Created',
        description: `The room "${data.name}" has been successfully created.`,
      });
    }
    form.reset(defaultFormValues);
  }

  const handleDeleteRoom = (roomId) => {
    if (editingRoom?.id === roomId) {
        setEditingRoom(null);
    }
    setRoomList(prev => prev.filter(room => room.id !== roomId));
    toast({
      title: 'Room Deleted',
      description: `The room has been successfully deleted.`,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          appendImage({ url: reader.result });
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          appendVideo({ url: reader.result });
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
    form.reset(defaultFormValues);
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Manage Rooms222</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
            <Card className="rounded-[2rem] border-none shadow-lg bg-card">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    {editingRoom ? <Edit className="w-5 h-5 text-primary" /> : <PlusCircle className="w-5 h-5 text-primary" />}
                    {editingRoom ? `Edit "${editingRoom.name}"` : 'Add New Room'}
                </CardTitle>
                <CardDescription className="text-xs">
                    {editingRoom ? 'Update the details for this room.' : 'Fill out the form below to add a new room.'}
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Room Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Deluxe Room" {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price per night (₹)</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A brief summary of the room..." {...field} className="rounded-xl border-slate-100 bg-slate-50/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longDescription"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A detailed description..." {...field} rows={4} className="rounded-xl border-slate-100 bg-slate-50/50" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amenities</FormLabel>
                        <div className="flex items-center gap-2">
                            <Input
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (amenityInput.trim()) {
                                            appendAmenity(amenityInput.trim());
                                            setAmenityInput('');
                                        }
                                    }
                                }}
                                placeholder="Add an amenity"
                                className="rounded-xl border-slate-100 bg-slate-50/50"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-4 rounded-xl border-slate-200"
                                onClick={() => {
                                    if (amenityInput.trim()) {
                                        appendAmenity(amenityInput.trim());
                                        setAmenityInput('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2 pt-2">
                            {amenityFields.map((field, index) => (
                                <div key={field.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2 pl-4">
                                    <span className="text-xs font-bold text-slate-600">{form.getValues(`amenities.${index}`)}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                                        onClick={() => removeAmenity(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <FormMessage>{form.formState.errors.amenities?.message}</FormMessage>
                    </FormItem>
                    
                    <div className="space-y-4 pt-4">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Media Assets</FormLabel>
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="rounded-2xl border-slate-100 bg-slate-50/50 overflow-hidden shadow-none">
                                <CardHeader className="p-4 bg-white/50 border-b border-slate-100">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Images</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {imageFields.map((field, index) => {
                                            const imageUrl = form.getValues(`images.${index}.url`);
                                            return (
                                                <div key={field.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-200">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={'Room preview'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center p-1 text-center">
                                                            <span className="text-[8px] text-slate-400 break-all">Invalid</span>
                                                        </div>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            );
                                        })}

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            <Plus className="h-6 w-6" />
                                            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Add</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                         <Button type="submit" className="flex-1 h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-black text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 transition-all active:scale-[0.98]">
                            {editingRoom ? 'Save Changes' : 'Add Room'}
                        </Button>
                        {editingRoom && (
                            <Button type="button" variant="outline" className="h-14 rounded-2xl px-6 border-slate-200 text-slate-400 font-bold" onClick={handleCancelEdit}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        )}
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-headline">Existing Rooms</h2>
             {roomList.map((room) => {
                const roomImage = (() => {
                    const firstImage = room.images[0];
                    if (!firstImage) return null;
                    if (firstImage.startsWith('http') || firstImage.startsWith('data:image')) return firstImage;
                    const placeholder = PlaceHolderImages.find(img => img.id === firstImage);
                    return placeholder ? placeholder.imageUrl : null;
                })();
                const roomVideo = room.videos?.[0];

                return (
                    <Card key={room.id} className="flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white group">
                        <div className="md:w-[40%] relative shrink-0 aspect-[4/3] md:aspect-auto bg-black overflow-hidden">
                            {roomVideo ? (
                                <video src={roomVideo} controls className="object-cover w-full h-full" />
                            ) : roomImage ? (
                                <img src={roomImage} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                    <ImageIcon className="w-12 h-12 text-slate-200" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                             <div className="mb-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#085d6b] mb-1">Premium Accommodation</p>
                                <h3 className="font-bold text-2xl lg:text-3xl leading-tight text-slate-900 font-headline">{room.name}</h3>
                                <p className="text-secondary font-black text-xl mt-2">₹{room.price.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase tracking-widest">/ Night</span></p>
                            </div>
                            <p className="text-slate-500 text-base mb-8 font-light leading-relaxed line-clamp-3">
                                {room.longDescription}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-full px-8 h-11 border-2 font-black uppercase tracking-widest text-[10px]" 
                                    onClick={() => setEditingRoom(room)}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> 
                                    Edit
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="rounded-full px-8 h-11 font-black uppercase tracking-widest text-[10px] shadow-none" 
                                    onClick={() => handleDeleteRoom(room.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> 
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                 )
             })}
        </div>
      </div>
    </div>
  );
}
