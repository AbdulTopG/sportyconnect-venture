
import { useEffect, useCallback, useState } from 'react';
import useFetchMatches from './match/use-fetch-matches';
import useMatchesRealtime from './match/use-matches-realtime';
import { toast } from './use-toast';

export function useMatches(selectedSport: string | null) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { matches, isLoading, error, fetchMatches } = useFetchMatches(selectedSport);

  // Set up fetch on initial load and when sport changes
  useEffect(() => {
    let isMounted = true;
    
    const loadMatches = async () => {
      try {
        await fetchMatches();
      } catch (err) {
        console.error('Error in initial matches load:', err);
        if (isMounted) {
          toast({
            title: "Error loading matches",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsInitialLoad(false);
        }
      }
    };
    
    // Reset initial load state when sport changes
    setIsInitialLoad(true);
    loadMatches();
    
    return () => {
      isMounted = false;
    };
  }, [fetchMatches, selectedSport]);
  
  // Callbacks for real-time updates
  const handleMatchesChange = useCallback(() => {
    console.log('Matches changed, refreshing data...');
    fetchMatches().catch(err => {
      console.error('Error refreshing matches after real-time update:', err);
    });
  }, [fetchMatches]);
  
  const handleParticipantsChange = useCallback(() => {
    console.log('Participants changed, refreshing data...');
    fetchMatches().catch(err => {
      console.error('Error refreshing matches after participants update:', err);
    });
  }, [fetchMatches]);
  
  // Set up realtime subscriptions
  useMatchesRealtime({
    onMatchesChange: handleMatchesChange,
    onParticipantsChange: handleParticipantsChange
  });

  return { 
    matches, 
    isLoading: isLoading || isInitialLoad, 
    error,
    isInitialLoad 
  };
}
