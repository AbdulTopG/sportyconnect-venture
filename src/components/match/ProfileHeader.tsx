
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Trophy, Upload, Loader2 } from 'lucide-react';
import { Profile } from '@/integrations/supabase/client';
import { useAvatarUpload } from '@/hooks/use-avatar-upload';
import { useProfileData } from '@/hooks/use-profile-data';

interface ProfileHeaderProps {
  user: Profile;
  isEditable?: boolean;
  onEditClick?: () => void;
}

const ProfileHeader = ({ user, isEditable = false, onEditClick }: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, handleAvatarChange } = useAvatarUpload();
  const { refreshProfileData } = useProfileData();
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      await handleAvatarChange(user.id, file, () => {
        refreshProfileData();
      });
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleAvatarClick = () => {
    if (isEditable && !isUploading) {
      fileInputRef.current?.click();
    }
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="relative">
            <Avatar 
              className={`h-24 w-24 ${isEditable && !isUploading ? 'cursor-pointer hover:opacity-90' : ''}`}
              onClick={handleAvatarClick}
            >
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="text-xl bg-sportyfi-orange text-white">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            
            {isEditable && !isUploading && (
              <button 
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                onClick={handleAvatarClick}
              >
                <Upload className="h-4 w-4" />
              </button>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*" 
              className="hidden"
              disabled={isUploading}
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold">
              {user.username || 'Anonymous Player'}
            </h2>
            
            {user.primary_sport && (
              <Badge className="mt-1 bg-sportyfi-orange" variant="secondary">
                {user.primary_sport}
              </Badge>
            )}
            
            {user.location && (
              <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
            )}
            
            {user.bio && (
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {user.bio}
              </p>
            )}
            
            {!user.bio && !user.location && (
              <p className="mt-2 text-sm text-muted-foreground">
                No bio provided
              </p>
            )}
          </div>
          
          {isEditable && (
            <div className="mt-2 md:mt-0">
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={onEditClick}
                size="sm"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
