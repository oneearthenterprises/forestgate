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
      <h1 className="text-3xl font-bold font-headline">Manage Rooms</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {editingRoom ? <Edit /> : <PlusCircle />}
                    {editingRoom ? `Edit "${editingRoom.name}"` : 'Add New Room'}
                </CardTitle>
                <CardDescription>
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
                            <FormLabel>Room Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Deluxe Room" {...field} />
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
                            <FormLabel>Price per night (₹)</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
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
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A brief summary of the room..." {...field} />
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
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A detailed description of the room and its features..." {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormItem>
                        <FormLabel>Amenities</FormLabel>
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
                            />
                            <Button
                                type="button"
                                variant="outline"
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
                                <div key={field.id} className="flex items-center justify-between rounded-md border bg-muted/50 p-2">
                                    <span className="text-sm">{form.getValues(`amenities.${index}`)}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeAmenity(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <FormMessage>{form.formState.errors.amenities?.message}</FormMessage>
                    </FormItem>
                    
                    <FormItem>
                        <FormLabel>Media</FormLabel>
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">Images</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {imageFields.map((field, index) => {
                                            const imageUrl = form.getValues(`images.${index}.url`);
                                            return (
                                                <div key={field.id} className="relative group aspect-square">
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={'Room image'}
                                                            fill
                                                            className="rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center p-1 text-center">
                                                            <span className="text-xs text-muted-foreground break-all">Invalid URL</span>
                                                        </div>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                                            className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <Plus className="h-8 w-8" />
                                            <span className="text-sm mt-1">Add Image</span>
                                        </button>
                                    </div>
                                    <FormMessage className="pt-2">{form.formState.errors.images?.root?.message}</FormMessage>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">Videos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {videoFields.map((field, index) => {
                                            const videoUrl = form.getValues(`videos.${index}.url`);
                                            return (
                                                <div key={field.id} className="relative group aspect-square">
                                                    {videoUrl ? (
                                                        <video
                                                            src={videoUrl}
                                                            controls
                                                            className="rounded-md object-cover w-full h-full bg-black"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center p-1 text-center">
                                                            <span className="text-xs text-muted-foreground break-all">Invalid URL</span>
                                                        </div>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        onClick={() => removeVideo(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            );
                                        })}

                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                            accept="video/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => videoInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <Video className="h-8 w-8" />
                                            <span className="text-sm mt-1">Add Video</span>
                                        </button>
                                    </div>
                                    <FormMessage className="pt-2">{form.formState.errors.videos?.root?.message}</FormMessage>
                                </CardContent>
                            </Card>
                        </div>
                    </FormItem>

                    <div className="flex items-center gap-2">
                         <Button type="submit" disabled={form.formState.isSubmitting}>
                            {editingRoom ? 'Save Changes' : 'Add Room'}
                        </Button>
                        {editingRoom && (
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
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
                    <Card key={room.id} className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3 aspect-video md:aspect-auto bg-black">
                            {roomVideo ? (
                                <video src={roomVideo} controls className="object-cover w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                            ) : roomImage ? (
                                <Image src={roomImage} alt={room.name} fill className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                             <CardHeader>
                                <CardTitle>{room.name}</CardTitle>
                                <CardDescription>₹{room.price.toLocaleString()} / night</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">{room.longDescription}</p>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingRoom(room)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </CardFooter>
                        </div>
                    </Card>
                 )
             })}
        </div>
      </div>
    </div>
  );
}
