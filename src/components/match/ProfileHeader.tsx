
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  user: {
    id: string;
    username?: string | null;
    avatar_url?: string | null;
    location?: string | null;
    primary_sport?: string | null;
    bio?: string | null;
  };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="sportyfi-card flex flex-col items-center p-6">
      <Avatar className="h-24 w-24 mb-4 border-2 border-sportyfi-orange">
        <AvatarImage src={user.avatar_url || ''} />
        <AvatarFallback className="text-2xl bg-sportyfi-orange text-white">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      
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
    </div>
  );
};

export default ProfileHeader;
