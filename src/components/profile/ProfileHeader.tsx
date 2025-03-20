
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/use-profile-data';
import { useAvatarUpload } from '@/hooks/use-avatar-upload';

interface ProfileHeaderProps {
  user: {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    primary_sport?: string | null;
    bio?: string | null;
  };
  isEditable?: boolean;
}

const ProfileHeader = ({ user, isEditable = false }: ProfileHeaderProps) => {
  const { user: authUser } = useAuth();
  const { refreshProfileData } = useProfileData();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isUploading,
    previewUrl,
    handleFileSelect,
    handleAvatarUpload,
    clearSelection
  } = useAvatarUpload();
  
  const canEdit = isEditable && authUser && authUser.id === user.id;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && handleFileSelect(file)) {
      setShowUploadDialog(true);
    }
    
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const uploadAvatar = async () => {
    if (!authUser) return;
    
    await handleAvatarUpload(authUser.id, () => {
      // Refresh profile data to show the updated avatar
      refreshProfileData();
      // Close dialog
      setShowUploadDialog(false);
    });
  };
  
  const cancelUpload = () => {
    clearSelection();
    setShowUploadDialog(false);
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
