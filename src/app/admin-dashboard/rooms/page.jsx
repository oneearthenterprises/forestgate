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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { roomApi } from '@/lib/api/rooms';
import Image from 'next/image';

const RoomFormSchema = z.object({
  name: z.string().min(3, 'Room name is required.'),
  description: z.string().min(10, 'Short description is required.'),
  longDescription: z.string().min(20, 'Long description is required.'),
  price: z.coerce.number().min(1000, 'Price must be at least 1000.'),
  tag: z.string().min(1, 'Room tag is required.'),
  amenities: z.array(z.string()).min(1, 'Please list at least one amenity.'),
  images: z.array(z.object({ 
    url: z.string().url({ message: "Please enter a valid URL." }),
    file: z.any().optional(),
    isNew: z.boolean().optional()
  })).optional(),
  videos: z.array(z.object({ 
    url: z.string().url({ message: "Please enter a valid URL." }),
    file: z.any().optional(),
    isNew: z.boolean().optional()
  })).optional(),
});

const defaultFormValues = {
  name: '',
  description: '',
  longDescription: '',
  price: 10000,
  tag: 'Premium Stay',
  amenities: ['Wi-Fi', 'Room Service'],
  images: [],
  videos: [],
};

// Default placeholder image (you can replace with your own URL)


export default function AdminRoomsPage() {
  const { toast } = useToast();
  const [roomList, setRoomList] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [amenityInput, setAmenityInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomTag, setIsCustomTag] = useState(false);
  const [customTagValue, setCustomTagValue] = useState("");
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const formRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: defaultFormValues,
  });

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await roomApi.getAllRooms();
      console.log('API Response:', data);
      
      // Handle different response structures
      let rooms = [];
      if (Array.isArray(data)) {
        rooms = data;
      } else if (data?.data && Array.isArray(data.data)) {
        rooms = data.data;
      } else if (data?.rooms && Array.isArray(data.rooms)) {
        rooms = data.rooms;
      } else {
        console.error('Unexpected data format:', data);
        rooms = [];
      }
      
      setRoomList(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch rooms. Please try again.',
        variant: 'destructive',
      });
      setRoomList([]);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  if (editingRoom) {
    form.reset({
      name: editingRoom.roomName || '',
      description: editingRoom.shortDescription || '',
      longDescription: editingRoom.fullDescription || '',
      price: editingRoom.pricePerNight || 10000,
      tag: editingRoom.tag || 'Premium Stay',
      amenities: editingRoom.amenities || [],
      images: (editingRoom.images || []).map((img) => ({
        url: img.url,
        _id: img._id,
        isNew: false,
      })),
      videos: (editingRoom.videos || []).map((vid) => ({
        url: vid.url,
        _id: vid._id,
        isNew: false,
      })),
    });

    // Check if the tag is custom
    const predefinedTags = ['Premium Stay', 'Couple Stay', 'Family Gathering', 'Birthday Party'];
    if (editingRoom.tag && !predefinedTags.includes(editingRoom.tag)) {
      setIsCustomTag(true);
      setCustomTagValue(editingRoom.tag);
      form.setValue('tag', 'Custom');
    } else {
      setIsCustomTag(false);
      setCustomTagValue("");
    }

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

async function onSubmit(data) {
  setIsSubmitting(true);

  try {
    const formData = new FormData();

    // Text fields
    formData.append("roomName", data.name);
    formData.append("shortDescription", data.description);
    formData.append("fullDescription", data.longDescription);
    formData.append("pricePerNight", data.price);
    formData.append("tag", data.tag === 'Custom' ? customTagValue : data.tag);

    data.amenities.forEach((item) => {
      formData.append("amenities", item);
    });

    // Images
    data.images?.forEach((img) => {
      if (img.file instanceof File) {
        formData.append("images", img.file);
      }
    });

    // Videos
    data.videos?.forEach((video) => {
      if (video.file instanceof File) {
        formData.append("videos", video.file);
      }
    });

    if (editingRoom) {
      await roomApi.updateRoom(editingRoom._id, formData);

      toast({
        title: "Room Updated",
        description: `The room "${data.name}" has been successfully updated.`,
      });

      setEditingRoom(null);
    } else {
      await roomApi.createRoom(formData);

      toast({
        title: "Room Created",
        description: `The room "${data.name}" has been successfully created.`,
      });
    }

    await fetchRooms();
    form.reset(defaultFormValues);

  } catch (error) {
    console.error("Submit error:", error);

    toast({
      title: "Error",
      description: error.message || "Failed to save room.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await roomApi.deleteRoom(roomId);
      
      if (editingRoom?._id === roomId) {
        setEditingRoom(null);
        form.reset(defaultFormValues);
      }
      
      // Refresh the room list
      await fetchRooms();
      
      toast({
        title: 'Room Deleted',
        description: 'The room has been successfully deleted.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete room. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      appendImage({ 
        url: previewUrl,
        file: file,
        isNew: true
      });
    });
    
    event.target.value = '';
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      appendVideo({ 
        url: previewUrl,
        file: file,
        isNew: true
      });
    });
    
    event.target.value = '';
  };

const handleDeleteImage = async (index, image) => {
  if (editingRoom && image._id) {
    try {
      await roomApi.deleteRoomImage(editingRoom._id, image._id);

      toast({
        title: "Image Deleted",
        description: "Image removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);

      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });

      return;
    }
  }

  if (image.url?.startsWith("blob:")) {
    URL.revokeObjectURL(image.url);
  }

  removeImage(index);
};

const handleDeleteVideo = async (index, video) => {
  if (editingRoom && video._id) {
    try {
      await roomApi.deleteRoomVideo(editingRoom._id, video._id);

      toast({
        title: "Video Deleted",
        description: "Video removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting video:", error);

      toast({
        title: "Error",
        description: "Failed to delete video.",
        variant: "destructive",
      });

      return;
    }
  }

  if (video.url?.startsWith("blob:")) {
    URL.revokeObjectURL(video.url);
  }

  removeVideo(index);
};

  const handleCancelEdit = () => {
    setEditingRoom(null);
    form.reset(defaultFormValues);
    setIsCustomTag(false);
    setCustomTagValue("");
    
    // Clean up any blob URLs
    imageFields.forEach(field => {
      if (field.url?.startsWith('blob:')) {
        URL.revokeObjectURL(field.url);
      }
    });
    videoFields.forEach(field => {
      if (field.url?.startsWith('blob:')) {
        URL.revokeObjectURL(field.url);
      }
    });
  };

  // Handle image error - replace with default placeholder
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Manage Rooms</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-8" ref={formRef}>
          <Card className="rounded-[2rem] border-none shadow-lg bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {editingRoom ? <Edit className="w-5 h-5 text-primary" /> : <PlusCircle className="w-5 h-5 text-primary" />}
                {editingRoom ? `Edit "${editingRoom?.name || 'Room'}"` : 'Add New Room'}
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Room Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Deluxe Room" 
                            {...field} 
                            className="rounded-xl border-slate-100 bg-slate-50/50" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  


                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Room Tag
                        </FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            setIsCustomTag(val === 'Custom');
                          }} 
                          defaultValue={field.value} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-10">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="Premium Stay">Premium Stay</SelectItem>
                            <SelectItem value="Couple Stay">Couple Stay</SelectItem>
                            <SelectItem value="Family Gathering">Family Gathering</SelectItem>
                            <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                            <SelectItem value="Custom">Custom (Type below)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isCustomTag && (
                    <div className="space-y-2">
                       <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Enter Custom Tag
                        </FormLabel>
                       <Input 
                        placeholder="e.g., Honeymoon Suite" 
                        value={customTagValue}
                        onChange={(e) => setCustomTagValue(e.target.value)}
                        className="rounded-xl border-slate-100 bg-slate-50/50" 
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Short Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief summary of the room..." 
                            {...field} 
                            className="rounded-xl border-slate-100 bg-slate-50/50" 
                          />
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
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Full Description
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A detailed description..." 
                            {...field} 
                            rows={4} 
                            className="rounded-xl border-slate-100 bg-slate-50/50" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Amenities Section */}
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Amenities
                    </FormLabel>
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
                          <span className="text-xs font-bold text-slate-600">
                            {form.getValues(`amenities.${index}`)}
                          </span>
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
                  
                  {/* Images Section */}
                  <div className="space-y-4 pt-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Images
                    </FormLabel>
                    
                    <Card className="rounded-2xl border-slate-100 bg-slate-50/50 overflow-hidden shadow-none">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-3 gap-3">
                          {imageFields.map((field, index) => {
                            const image = form.getValues(`images.${index}`);
                            return (
                              <div key={field.id} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-200">
                                {image?.url ? (
                                  <img
                                    src={image.url}
                                    alt="Room preview"
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
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
                                  onClick={() => handleDeleteImage(index, image)}
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
                            multiple
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

                  {/* Videos Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Videos
                    </FormLabel>
                    
                    <Card className="rounded-2xl border-slate-100 bg-slate-50/50 overflow-hidden shadow-none">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {videoFields.map((field, index) => {
                            const video = form.getValues(`videos.${index}`);
                            return (
                              <div key={field.id} className="relative group aspect-video rounded-xl overflow-hidden bg-slate-200">
                                {video?.url ? (
                                  <video
                                    src={video.url}
                                    className="w-full h-full object-cover"
                                    controls
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
                                  onClick={() => handleDeleteVideo(index, video)}
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
                            multiple
                          />
                          <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                          >
                            <Plus className="h-6 w-6" />
                            <span className="text-[9px] font-black uppercase tracking-widest mt-1">Add Video</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center gap-2 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1 h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-black text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 transition-all active:scale-[0.98]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          {editingRoom ? 'Saving...' : 'Adding...'}
                        </>
                      ) : (
                        editingRoom ? 'Save Changes' : 'Add Room'
                      )}
                    </Button>
                    
                    {editingRoom && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 rounded-2xl px-6 border-slate-200 text-slate-400 font-bold" 
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Rooms List Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-headline">Existing Rooms</h2>
          
          {!Array.isArray(roomList) || roomList.length === 0 ? (
            <Card className="p-12 text-center rounded-[2.5rem]">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No rooms found. Add your first room above.</p>
            </Card>
          ) : (
            roomList.map((room) => {
              if (!room || typeof room !== 'object') return null;
              
              const roomImage = room.images?.[0]?.url || null;
  const roomName = room.roomName || 'Unnamed Room';
              const roomPrice = typeof room.pricePerNight === 'number' ? room.pricePerNight : 0;
              const roomDescription = room.fullDescription || room.shortDescription || 'No description available';
              const roomId = room.id || `temp-${Date.now()}-${Math.random()}`;

              return (
                <Card key={roomId} className="flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white group">
                  <div className="md:w-[40%] relative shrink-0 aspect-[4/3] md:aspect-auto bg-black overflow-hidden">
                    {roomImage ? (
                      <Image 
                        src={roomImage} 
                        alt={roomName} 
                        width={500}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <ImageIcon className="w-12 h-12 text-slate-200" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center min-w-0">
                    <div className="mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#085d6b] mb-1">
                        {room.tag || "Premium Stay"}
                      </p>
                      <h3 className="font-headline text-2xl lg:text-4xl font-black text-slate-900 leading-[1.1]">
                        {roomName}
                      </h3>
                      <p className="text-secondary font-black text-2xl mt-4 flex items-baseline gap-2">
                        <span className="text-sm font-black uppercase tracking-tighter text-slate-400">Price per night</span>
                        ₹{roomPrice.toLocaleString()}
                      </p>
                    </div>
                    
                    <p className="text-slate-500 text-base mb-6 font-light leading-relaxed line-clamp-3 break-all">
                      {roomDescription}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                       {room.amenities?.map((amenity, idx) => (
                         <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full border border-slate-100 uppercase tracking-tighter transition-colors hover:bg-slate-100">
                           {amenity}
                         </span>
                       ))}
                       {(!room.amenities || room.amenities.length === 0) && (
                         <span className="text-[10px] text-slate-300 italic uppercase tracking-widest">No amenities listed</span>
                       )}
                    </div>
                    
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
                     onClick={() => handleDeleteRoom(room._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            }).filter(Boolean)
          )}
        </div>
      </div>
    </div>
  );
}