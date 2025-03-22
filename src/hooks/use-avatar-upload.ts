
import { useState } from 'react';
import { uploadAvatar, updateProfile } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (userId: string, file: File | null, onSuccess?: (url: string) => void) => {
    if (!file || !userId) return;
    
    // Validate file type and size
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, JPEG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the avatar to Supabase storage
      const avatarUrl = await uploadAvatar(userId, file);
      
      // Update the user's profile with the new avatar URL
      await updateProfile(userId, { avatar_url: avatarUrl });
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });
      
      if (onSuccess) {
        onSuccess(avatarUrl);
      }
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    isUploading,
    handleAvatarChange,
  };
}
