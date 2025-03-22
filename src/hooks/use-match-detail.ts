
import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import useFetchMatch from './match/use-fetch-match';
import useMatchParticipants from './match/use-match-participants';
import useMatchActions from './match/use-match-actions';
import useMatchRealtime from './match/use-match-realtime';

export type { ParticipantWithProfile } from './match/use-match-participants';
export type { Host } from './match/use-fetch-match';

export const useMatchDetail = (matchId: string | undefined) => {
  const { user } = useAuth();
  
  // Get match data
  const { match, host, isLoading, error, fetchMatchData } = useFetchMatch(matchId);
  
  // Get participants data
  const { 
    participants, 
    isJoinSuccess, 
    fetchParticipants, 
    isLoadingParticipants 
  } = useMatchParticipants(match, matchId);
  
  // Set up match actions (join/leave)
  const {
    isJoining,
    userIsParticipant,
    matchIsFull,
    isHost,
    handleJoinMatch,
    handleLeaveMatch
  } = useMatchActions(match, participants, fetchParticipants, fetchMatchData);
  
  // Force refresh callback functions for realtime updates
  const handleMatchChange = useCallback(() => {
    fetchMatchData(true);
  }, [fetchMatchData]);
  
  const handleParticipantsChange = useCallback(() => {
    fetchParticipants();
  }, [fetchParticipants]);
  
  // Set up realtime subscriptions
  useMatchRealtime(matchId, handleMatchChange, handleParticipantsChange);

  return {
    match,
    participants,
    host,
    isLoading: isLoading || isLoadingParticipants,
    error,
    isJoining,
    isJoinSuccess,
    userIsParticipant,
    matchIsFull,
    isHost,
    handleJoinMatch,
    handleLeaveMatch
  };
};
