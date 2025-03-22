
import { useState, useCallback, useRef } from 'react';
import { supabase, Match } from '@/integrations/supabase/client';

/**
 * Hook to fetch matches data from Supabase with optimized performance
 */
const useFetchMatches = (selectedSport: string | null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMatches = useCallback(async () => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
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
      
      // If component unmounted or a new request started, don't update state
      if (!isMounted || abortController.signal.aborted) return;
      
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
      // If component unmounted or a new request started, don't update state
      if (!isMounted || abortController.signal.aborted) return;
      
      console.error("Unexpected error fetching matches:", err);
      setError("An unexpected error occurred. Please try again.");
      setMatches([]);
    } finally {
      if (isMounted && !abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
      abortControllerRef.current = null;
    };
  }, [selectedSport]);

  // Cleanup on unmount
  useCallback(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    matches,
    isLoading,
    error,
    fetchMatches
  };
};

export default useFetchMatches;
