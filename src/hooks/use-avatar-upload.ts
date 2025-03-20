
import { useState } from 'react';
import { uploadAvatar, updateProfile } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to validate the file before processing
  const validateFile = (file: File): boolean => {
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, JPEG, etc.)",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // Function to prepare a file for preview
  const prepareFileForPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Function to handle file selection
  const handleFileSelect = (file: File | null): boolean => {
    if (!file) return false;
    
    if (!validateFile(file)) {
      return false;
    }
    
    setSelectedFile(file);
    setPreviewUrl(prepareFileForPreview(file));
    return true;
  };

  // Function to clear the current selection
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  // Main upload function
  const handleAvatarUpload = async (userId: string, onSuccess?: (url: string) => void) => {
    if (!selectedFile || !userId) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Add a timestamp to bypass browser cache when the image is updated
      const timestamp = new Date().getTime();
      
      // Upload the avatar to Supabase storage
      const avatarUrl = await uploadAvatar(userId, selectedFile);
      
      // Append cache-busting parameter to the URL
      const cacheBustedUrl = `${avatarUrl}?t=${timestamp}`;
      
      // Update the user's profile with the new avatar URL
      await updateProfile(userId, { avatar_url: avatarUrl });
      
      // Clear the current selection
      clearSelection();
      
      if (onSuccess) {
        onSuccess(cacheBustedUrl);
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
    previewUrl,
    selectedFile,
    handleFileSelect,
    handleAvatarUpload,
    clearSelection,
  };
}
