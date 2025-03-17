
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Loader2 } from 'lucide-react';
import { Match } from '@/integrations/supabase/client';

interface MatchActionsProps {
  match: Match;
  userIsParticipant: boolean;
  isJoining: boolean;
  matchIsFull: boolean;
  isHost: boolean;
  isSharing: boolean;
  handleJoinMatch: () => void;
  handleLeaveMatch: () => void;
  handleShare: () => void;
}

const MatchActions = ({ 
  userIsParticipant,
  isJoining,
  matchIsFull,
  isHost,
  isSharing,
  handleJoinMatch,
  handleLeaveMatch,
  handleShare
}: MatchActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {userIsParticipant ? (
        <Button 
          onClick={handleLeaveMatch}
          disabled={isJoining}
          variant="destructive"
          className="w-full"
        >
          {isJoining ? "Processing..." : "Leave Match"}
        </Button>
      ) : (
        <Button 
          onClick={handleJoinMatch}
          disabled={isJoining || matchIsFull || isHost}
          className={`w-full ${!matchIsFull && !isHost ? "bg-sportyfi-orange hover:bg-red-600 text-white" : ""}`}
        >
          {isJoining ? "Joining..." : isHost ? "You're the host" : matchIsFull ? "Match Full" : "Join This Match"}
        </Button>
      )}
      
      <Button 
        onClick={handleShare}
        variant="outline"
        className="w-full"
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )}
        {isSharing ? "Processing..." : "Copy Link"}
      </Button>
    </div>
  );
};

export default MatchActions;
