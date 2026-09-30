'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { API } from '@/lib/api/api';
import { Loader2, UploadCloud, Save, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function PopupSettingsPage() {
  const [data, setData] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    subLocation: '',
    isActive: true,
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPopupData();
  }, []);

  const fetchPopupData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API.GetWelcomePopup);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setRemoveImage(false);
      }
    } catch (error) {
      console.error('Error fetching popup data:', error);
      toast({ title: 'Error', description: 'Failed to load popup data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(true);
    setData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast({ 
      title: 'Image removed', 
      description: "Click 'Save Configuration' below to save changes." 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('isActive', data.isActive);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (removeImage || !data.imageUrl) {
        formData.append('removeImage', 'true');
      }

      const res = await fetch(API.UpdateWelcomePopup, {
        method: 'PUT',
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        toast({ title: 'Success', description: 'Welcome Popup updated successfully!' });
        setData(json.data);
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast({ title: 'Error', description: json.message || 'Failed to update', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Saving error:', error);
      toast({ title: 'Error', description: 'An error occurred while saving', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const currentImage = (!removeImage && (imagePreview || data.imageUrl)) ? (imagePreview || data.imageUrl) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Welcome Popup Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popup Configuration</CardTitle>
          <CardDescription>
            Change the text, image, and toggle visibility of the welcome popup modal on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Toggle Active */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
              <div>
                <Label className="text-base">Enable Welcome Popup</Label>
                <p className="text-sm text-muted-foreground">Turn the popup on or off globally.</p>
              </div>
              <Checkbox 
                checked={data.isActive}
                onCheckedChange={(val) => setData({ ...data, isActive: val })}
                className="w-5 h-5 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Text Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Textarea 
                    rows={3}
                    placeholder="Book entire rental unit..."
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">You can use enters/newlines here to break lines in the UI.</p>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    rows={4}
                    placeholder="Welcome to this stunning sanctuary..."
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Background Image</Label>
                  {currentImage && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="text-xs font-semibold text-destructive hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Image
                    </button>
                  )}
                </div>

                {currentImage ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-[4/5] bg-muted rounded-xl overflow-hidden border shadow-sm group">
                      <Image 
                        src={currentImage} 
                        alt="Popup preview" 
                        fill 
                        className="object-cover"
                      />
                      {/* Top-right quick delete button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md z-10 hover:scale-105 transition-transform"
                        onClick={handleDeleteImage}
                        title="Delete Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="rounded-full shadow text-xs font-medium"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadCloud className="w-4 h-4 mr-1.5" />
                          Change
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="rounded-full shadow text-xs font-medium"
                          onClick={handleDeleteImage}
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg text-xs"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud className="w-4 h-4 mr-1.5 text-primary" />
                        Upload New Image
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-lg text-xs"
                        onClick={handleDeleteImage}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors aspect-[4/5] bg-muted/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-4 bg-muted rounded-full mb-3 text-muted-foreground">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-sm text-foreground">No image set</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      A brand dark gradient background will be used on the welcome popup.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary mt-4 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      Upload Image
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto mt-4 px-8">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
