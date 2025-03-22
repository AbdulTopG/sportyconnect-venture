
import { useEffect, useCallback } from 'react';
import useFetchMatches from './match/use-fetch-matches';
import useMatchesRealtime from './match/use-matches-realtime';

export function useMatches(selectedSport: string | null) {
  const { matches, isLoading, error, fetchMatches } = useFetchMatches(selectedSport);

  // Set up fetch on initial load and when sport changes
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches, selectedSport]);
  
  // Callbacks for real-time updates
  const handleMatchesChange = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);
  
  const handleParticipantsChange = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);
  
  // Set up realtime subscriptions
  useMatchesRealtime({
    onMatchesChange: handleMatchesChange,
    onParticipantsChange: handleParticipantsChange
  });

  return { matches, isLoading, error };
}
