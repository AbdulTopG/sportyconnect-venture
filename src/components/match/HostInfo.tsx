
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Host {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
}

interface HostInfoProps {
  host: Host | null;
}

const HostInfo = ({ host }: HostInfoProps) => {
  return (
    <div className="sportyfi-card">
      <h2 className="text-lg font-semibold mb-4">Host</h2>
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={host?.avatar_url || ''} />
          <AvatarFallback className="bg-sportyfi-orange text-white">{host?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{host?.username || 'Anonymous Host'}</p>
          <p className="text-sm text-gray-500">Host</p>
        </div>
      </div>
    </div>
  );
};

export default HostInfo;
