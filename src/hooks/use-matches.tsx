
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase, Match } from '@/integrations/supabase/client';

export function useMatches(selectedSport: string | null) {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches from Supabase
  useEffect(() => {
    let isMounted = true;
    
    const fetchMatches = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching matches with filter:', selectedSport);
        let query = supabase.from('matches').select('*');
        
        // Apply sport filter if selected
        if (selectedSport) {
          query = query.eq('sport', selectedSport);
        }
        
        // Sort by match time, most recent first
        query = query.order('match_time', { ascending: true });
        
        const { data, error: supabaseError } = await query;
        
        if (!isMounted) return;
        
        if (supabaseError) {
          console.error("Error fetching matches:", supabaseError);
          setError("Failed to load matches. Please try again.");
          setMatches([]);
          return;
        }
        
        console.log("Matches fetched:", data);
        
        if (data === null) {
          setMatches([]);
        } else {
          setMatches(data);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Unexpected error fetching matches:", err);
        setError("An unexpected error occurred. Please try again.");
        setMatches([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchMatches();
    
    // Set up real-time subscription to matches table for any changes
    const matchesChannel = supabase
      .channel('public:matches:all')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' }, 
        async (payload) => {
          if (!isMounted) return;
          
          console.log('Match data changed:', payload);
          
          // Refetch all matches to ensure we have the latest data
          // This is more reliable than trying to update individual matches
          fetchMatches();
          
          // Show toast notification for newly created matches
          if (payload.eventType === 'INSERT') {
            const newMatch = payload.new as Match;
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
    // Changes here affect available_slots in matches
    const participantsChannel = supabase
      .channel('public:participants:all')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        (payload) => {
          if (!isMounted) return;
          
          console.log('Participants data changed:', payload);
          // Refetch all matches to get updated available_slots
          fetchMatches();
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
  }, [selectedSport, user?.id]);

  return { matches, isLoading, error };
}
