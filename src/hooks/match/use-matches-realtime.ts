
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type RealtimeConfig = {
  onMatchesChange: () => void;
  onParticipantsChange: () => void;
};

/**
 * Hook to handle real-time subscriptions for matches
 */
const useMatchesRealtime = ({ onMatchesChange, onParticipantsChange }: RealtimeConfig) => {
  const { user } = useAuth();
  
  useEffect(() => {
    let isMounted = true;
    
    // Set up real-time subscription to matches table for any changes
    const matchesChannel = supabase
      .channel('public:matches:all')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' }, 
        async (payload) => {
          if (!isMounted) return;
          
          console.log('Match data changed:', payload);
          
          // Refetch all matches to ensure we have the latest data
          onMatchesChange();
          
          // Show toast notification for newly created matches
          if (payload.eventType === 'INSERT') {
            const newMatch = payload.new as any;
            if (newMatch.host_id !== user?.id) {
              toast({
                title: "New Match Created",
                description: `A new ${newMatch.sport} match has been added.`,
              });
            }
          }
        }
      )
      .subscribe();
    
    // Set up real-time subscription to participants table
    const participantsChannel = supabase
      .channel('public:participants:all')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        (payload) => {
          if (!isMounted) return;
          
          console.log('Participants data changed:', payload);
          // Refetch all matches to get updated available_slots
          onParticipantsChange();
        }
      )
      .subscribe();
    
    console.log('Subscribed to realtime updates for matches and participants');
    
    // Cleanup function
    return () => {
      isMounted = false;
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [onMatchesChange, onParticipantsChange, user?.id]);
};

export default useMatchesRealtime;
