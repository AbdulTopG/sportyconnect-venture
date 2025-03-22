
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type RealtimeConfig = {
  onMatchesChange: () => void;
  onParticipantsChange: () => void;
};

/**
 * Hook to handle real-time subscriptions for matches with improved stability
 */
const useMatchesRealtime = ({ onMatchesChange, onParticipantsChange }: RealtimeConfig) => {
  const matchesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const participantsChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  useEffect(() => {
    let isMounted = true;
    
    const setupSubscriptions = () => {
      try {
        // Clean up existing subscriptions if any
        if (matchesChannelRef.current) {
          supabase.removeChannel(matchesChannelRef.current);
        }
        
        if (participantsChannelRef.current) {
          supabase.removeChannel(participantsChannelRef.current);
        }
        
        // Set up real-time subscription to matches table for any changes
        const matchesChannel = supabase
          .channel('public:matches:all')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'matches' }, 
            (payload) => {
              if (!isMounted) return;
              
              console.log('Match data changed:', payload.eventType);
              
              // Refetch all matches to ensure we have the latest data
              onMatchesChange();
            }
          )
          .subscribe((status) => {
            console.log(`Matches subscription status: ${status}`);
            
            if (status === 'CHANNEL_ERROR' && isMounted && retryCountRef.current < maxRetries) {
              console.log(`Retrying matches subscription (attempt ${retryCountRef.current + 1}/${maxRetries})...`);
              retryCountRef.current++;
              setTimeout(setupSubscriptions, 1000 * retryCountRef.current); // Exponential backoff
            }
          });
        
        matchesChannelRef.current = matchesChannel;
        
        // Set up real-time subscription to participants table
        const participantsChannel = supabase
          .channel('public:participants:all')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'participants' },
            (payload) => {
              if (!isMounted) return;
              
              console.log('Participants data changed:', payload.eventType);
              // Refetch all matches to get updated available_slots
              onParticipantsChange();
            }
          )
          .subscribe((status) => {
            console.log(`Participants subscription status: ${status}`);
          });
        
        participantsChannelRef.current = participantsChannel;
        
        console.log('Subscribed to realtime updates for matches and participants');
      } catch (err) {
        console.error('Error setting up realtime subscriptions:', err);
      }
    };
    
    // Set a small timeout to ensure all necessary initialization is complete
    const timer = setTimeout(() => {
      setupSubscriptions();
    }, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      isMounted = false;
      
      if (matchesChannelRef.current) {
        supabase.removeChannel(matchesChannelRef.current);
      }
      
      if (participantsChannelRef.current) {
        supabase.removeChannel(participantsChannelRef.current);
      }
      
      console.log('Unsubscribed from realtime updates');
    };
  }, [onMatchesChange, onParticipantsChange]);
};

export default useMatchesRealtime;
