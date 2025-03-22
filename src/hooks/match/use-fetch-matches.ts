
import { useState, useCallback } from 'react';
import { supabase, Match } from '@/integrations/supabase/client';

/**
 * Hook to fetch matches data from Supabase
 */
const useFetchMatches = (selectedSport: string | null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    let isMounted = true;
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
  }, [selectedSport]);

  return {
    matches,
    isLoading,
    error,
    fetchMatches
  };
};

export default useFetchMatches;
