
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const useMatchRealtime = (
  matchId: string | undefined,
  onMatchChange: () => void,
  onParticipantsChange: () => void
) => {
  useEffect(() => {
    if (!matchId) return;
    
    const matchChannel = supabase
      .channel(`match-detail-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          console.log('Match data change detected:', payload);
          onMatchChange();
        }
      )
      .subscribe();
      
    const participantsChannel = supabase
      .channel(`participants-detail-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('Participants change detected:', payload);
          onParticipantsChange();
        }
      )
      .subscribe();
    
    console.log('Subscribed to realtime updates for match details');
    
    return () => {
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [matchId, onMatchChange, onParticipantsChange]);
};

export default useMatchRealtime;
