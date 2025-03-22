
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Participant } from '@/integrations/supabase/client';

type ParticipantWithProfile = Participant & {
  profile?: {
    username?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
};

interface ParticipantsListProps {
  participants: ParticipantWithProfile[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  return (
    <div className="sportyfi-card">
      <h2 className="text-lg font-semibold mb-4">Participants ({participants.length})</h2>
      {participants.length > 0 ? (
        <div className="space-y-3">
          {participants.map(participant => (
            <div key={participant.id} className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border-2 border-sportyfi-orange">
                <AvatarImage src={participant.profile?.avatar_url || ''} alt={participant.profile?.username || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-sportyfi-orange text-white">
                  {participant.profile?.username?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium">{participant.profile?.username || 'Anonymous User'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No participants have joined yet.</p>
      )}
    </div>
  );
};

export default ParticipantsList;
