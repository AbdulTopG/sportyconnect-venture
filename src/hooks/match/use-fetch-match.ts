
import { useState, useEffect } from 'react';
import { supabase, Match } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Host = {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
};

const useFetchMatch = (matchId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [host, setHost] = useState<Host | null>(null);

  const fetchMatchData = async (forceRefresh = false) => {
    if (!matchId) return;
    
    console.log(`useFetchMatch: Fetching match data${forceRefresh ? ' (forced refresh)' : ''}`);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      if (matchError) {
        console.error("Error fetching match:", matchError);
        setError("Failed to load match details. Please try again.");
        setIsLoading(false);
        return null;
      }
      
      console.log("Fetched match data:", matchData);
      
      if (matchData) {
        setMatch(matchData);
        
        if (matchData.host_id) {
          const { data: hostData, error: hostError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', matchData.host_id)
            .maybeSingle();
          
          if (hostError && hostError.code !== 'PGRST116') {
            console.error("Error fetching host:", hostError);
          } else if (hostData) {
            setHost({
              id: matchData.host_id,
              username: hostData.username || undefined,
              avatar_url: hostData.avatar_url || undefined
            });
          } else {
            setHost({
              id: matchData.host_id
            });
          }
        }
      }
      
      return matchData;
    } catch (err) {
      console.error("Unexpected error fetching match details:", err);
      setError("An unexpected error occurred. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, [matchId]);

  return {
    match,
    host,
    isLoading,
    error,
    fetchMatchData
  };
};

export default useFetchMatch;
