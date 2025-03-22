
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarUploadProps {
  userId: string;
  avatarUrl: string;
  username: string;
  onAvatarChange: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

const ProfileAvatarUpload = ({ userId, avatarUrl, username, onAvatarChange }: ProfileAvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Avatar image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a JPEG or PNG image",
        variant: "destructive",
      });
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    onAvatarChange(objectUrl);

    // Upload to Supabase Storage
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update avatar_url in the preview
      if (data) {
        onAvatarChange(data.publicUrl);
      }
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture will be updated when you save changes",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="h-24 w-24 mb-3 border-2 border-sportyfi-orange">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-2xl bg-sportyfi-orange text-white">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="relative">
        <Input
          type="file"
          id="avatar"
          className="sr-only"
          onChange={handleAvatarChange}
          accept="image/jpeg, image/png"
        />
        <Label
          htmlFor="avatar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm font-medium transition-colors"
        >
          <Image className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Label>
      </div>
      <p className="text-xs text-muted-foreground mt-2">JPEG or PNG, max 5MB</p>
    </div>
  );
};

export default ProfileAvatarUpload;
