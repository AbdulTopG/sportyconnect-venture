
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Camera, Loader2, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/use-profile-data';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateProfileCompleteness } from '@/lib/profile-utils';

interface ProfileHeaderProps {
  user: {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    primary_sport?: string | null;
    bio?: string | null;
    preferred_sports?: string[] | null;
  };
  isEditable?: boolean;
}

const ProfileHeader = ({ user, isEditable = false }: ProfileHeaderProps) => {
  const { user: authUser } = useAuth();
  const { refreshProfileData } = useProfileData();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const canEdit = isEditable && authUser && authUser.id === user.id;
  
  // Calculate profile completeness
  const { completeness, missingFields } = calculateProfileCompleteness(user);
  
  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowUploadDialog(true);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const uploadAvatar = async () => {
    if (!selectedFile || !authUser) return;
    
    setIsUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      if (!urlData) throw new Error("Failed to get public URL");
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', authUser.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      });
      
      // Refresh profile data
      refreshProfileData();
      
      // Close dialog
      setShowUploadDialog(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your avatar",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const cancelUpload = () => {
    setShowUploadDialog(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="sportyfi-card flex flex-col items-center p-6">
      <div className="relative">
        <Avatar className="h-24 w-24 mb-4 border-2 border-sportyfi-orange">
          <AvatarImage src={user.avatar_url || ''} />
          <AvatarFallback className="text-2xl bg-sportyfi-orange text-white">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {canEdit && (
          <Button 
            size="icon-sm" 
            className="absolute bottom-3 right-0 rounded-full bg-sportyfi-orange hover:bg-red-600"
            onClick={triggerFileInput}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change avatar</span>
          </Button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      <h2 className="text-xl font-bold">{user.username || 'SportyFi User'}</h2>
      
      {user.location && (
        <div className="flex items-center text-sm text-gray-500 mb-2 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{user.location}</span>
        </div>
      )}
      
      {user.primary_sport && (
        <Badge className="mb-4 bg-blue-500">{user.primary_sport}</Badge>
      )}
      
      {/* Profile completeness indicator */}
      {canEdit && (
        <div className="w-full mt-2 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Profile Completeness</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Profile completion info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {missingFields.length > 0 
                      ? `To complete your profile, add: ${missingFields.join(', ')}`
                      : 'Your profile is complete!'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm font-medium">{completeness}%</span>
          </div>
          <Progress value={completeness} className="h-2" />
        </div>
      )}
      
      {user.bio && (
        <p className="text-center text-gray-600 text-sm">{user.bio}</p>
      )}
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update profile picture</DialogTitle>
          </DialogHeader>
          
          {previewUrl && (
            <div className="flex justify-center p-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-[300px] max-w-full object-contain rounded-md"
              />
            </div>
          )}
          
          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={cancelUpload} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={uploadAvatar} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
