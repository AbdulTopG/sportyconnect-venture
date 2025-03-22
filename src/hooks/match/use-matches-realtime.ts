
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type RealtimeConfig = {
  onMatchesChange: () => void;
  onParticipantsChange: () => void;
};

/**
 * Hook to handle real-time subscriptions for matches with improved stability
 */
const useMatchesRealtime = ({ onMatchesChange, onParticipantsChange }: RealtimeConfig) => {
  const { user } = useAuth();
  const matchesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const participantsChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
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
          .subscribe((status) => {
            console.log(`Matches subscription status: ${status}`);
            
            if (status === 'CHANNEL_ERROR' && isMounted && retryCount < maxRetries) {
              console.log(`Retrying matches subscription (attempt ${retryCount + 1}/${maxRetries})...`);
              retryCount++;
              setTimeout(setupSubscriptions, 1000 * retryCount); // Exponential backoff
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
              
              console.log('Participants data changed:', payload);
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
    
    setupSubscriptions();
    
    // Cleanup function
    return () => {
      isMounted = false;
      console.log('Unsubscribing from realtime updates');
      
      if (matchesChannelRef.current) {
        supabase.removeChannel(matchesChannelRef.current);
      }
      
      if (participantsChannelRef.current) {
        supabase.removeChannel(participantsChannelRef.current);
      }
    };
  }, [onMatchesChange, onParticipantsChange, user?.id]);
};

export default useMatchesRealtime;
