
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
    const fetchMatches = async () => {
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
        
        if (supabaseError) {
          console.error("Error fetching matches:", supabaseError);
          setError("Failed to load matches. Please try again.");
          setMatches([]);
          return;
        }
        
        console.log("Matches fetched:", data);
        setMatches(data || []);
      } catch (err) {
        console.error("Unexpected error fetching matches:", err);
        setError("An unexpected error occurred. Please try again.");
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
    
    // Set up real-time subscription to matches
    const matchesChannel = supabase
      .channel('public:matches')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'matches' }, 
        (payload) => {
          console.log('New match created:', payload);
          const newMatch = payload.new as Match;
          
          // Only add the match if it matches the current filter
          if (!selectedSport || newMatch.sport === selectedSport) {
            setMatches(currentMatches => {
              // Check if the match already exists in our list
              if (currentMatches.some(match => match.id === newMatch.id)) {
                return currentMatches;
              }
              // Add the new match and re-sort
              const updatedMatches = [...currentMatches, newMatch];
              return updatedMatches.sort((a, b) => 
                new Date(a.match_time).getTime() - new Date(b.match_time).getTime()
              );
            });
            
            // Show a toast notification for newly created matches
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
    
    console.log('Subscribed to realtime updates for matches');
    
    // Cleanup function
    return () => {
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(matchesChannel);
    };
  }, [selectedSport, user?.id]);

  return { matches, isLoading, error };
}
