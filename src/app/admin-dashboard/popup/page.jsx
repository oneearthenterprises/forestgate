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
import { Loader2, UploadCloud, Save } from 'lucide-react';
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
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
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
                <Label>Background Image</Label>
                <div 
                  className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative w-full aspect-[4/5] bg-muted rounded-lg overflow-hidden mb-4">
                    {(imagePreview || data.imageUrl) ? (
                      <Image 
                        src={imagePreview || data.imageUrl} 
                        alt="Popup preview" 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image provided</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <UploadCloud className="w-4 h-4" />
                    Upload New Image
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP (Max 5MB)
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
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
