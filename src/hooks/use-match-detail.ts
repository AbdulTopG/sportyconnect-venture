import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase, Match, Participant } from '@/integrations/supabase/client';

type Host = {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
};

export type ParticipantWithProfile = Participant & {
  profile?: {
    username?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
};

export const useMatchDetail = (matchId: string | undefined) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([]);
  const [host, setHost] = useState<Host | null>(null);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

  const fetchMatchDetails = async (forceRefresh = false) => {
    if (!matchId) return;
    
    console.log(`Fetching match details${forceRefresh ? ' (forced refresh)' : ''}`);

    if (isProcessingTransaction && !forceRefresh) {
      console.log("Skipping fetch during transaction processing");
      return;
    }
    
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
        return;
      }
      
      console.log("Fetched match data:", matchData);
      
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('match_id', matchId);
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return;
      }
      
      console.log("Participants fetched:", participantsData);
      
      const participantCount = participantsData?.length || 0;
      const calculatedAvailableSlots = Math.max(0, matchData.team_size - participantCount);
      
      const updatedMatchData = {
        ...matchData,
        available_slots: calculatedAvailableSlots
      };
      
      if (matchData.available_slots !== calculatedAvailableSlots) {
        console.log(`Updating available slots from ${matchData.available_slots} to ${calculatedAvailableSlots}`);
        
        const { error: updateError } = await supabase
          .from('matches')
          .update({ available_slots: calculatedAvailableSlots })
          .eq('id', matchId);
        
        if (updateError) {
          console.error("Error updating available slots:", updateError);
        }
      }
      
      setMatch(updatedMatchData);
      
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
      
      if (participantsData && participantsData.length > 0) {
        const enhancedParticipants: ParticipantWithProfile[] = [];
        
        for (const participant of participantsData) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', participant.user_id)
              .maybeSingle();
            
            enhancedParticipants.push({
              ...participant,
              profile: {
                username: profileData?.username || null,
                avatar_url: profileData?.avatar_url || null
              }
            });
          } catch (err) {
            console.error("Error fetching profile for participant:", err);
            enhancedParticipants.push({
              ...participant,
              profile: { username: null, avatar_url: null }
            });
          }
        }
        
        setParticipants(enhancedParticipants);
      } else {
        setParticipants([]);
      }
      
      if (user && participantsData) {
        const userParticipating = participantsData.some(p => p.user_id === user.id);
        setIsJoinSuccess(userParticipating);
      }
    } catch (err) {
      console.error("Unexpected error fetching match details:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const performAtomicOperation = async (operation: () => Promise<void>) => {
    if (isProcessingTransaction) {
      console.log("Operation rejected - another transaction is in progress");
      toast({
        title: "Please wait",
        description: "Your previous request is still processing",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingTransaction(true);
    try {
      await operation();
    } finally {
      setTimeout(() => {
        setIsProcessingTransaction(false);
      }, 1000);
    }
  };

  const handleJoinMatch = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join this match",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!match) return;
    
    await performAtomicOperation(async () => {
      setIsJoining(true);
      
      try {
        if (participants.some(p => p.user_id === user.id)) {
          toast({
            title: "Already joined",
            description: "You are already a participant in this match.",
          });
          return;
        }
        
        const { data: latestMatch, error: latestMatchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', match.id)
          .single();
        
        if (latestMatchError) {
          throw new Error("Could not fetch latest match data");
        }
        
        if (latestMatch.available_slots <= 0) {
          toast({
            title: "Match is full",
            description: "Sorry, this match is already full.",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Starting join transaction");
        
        const { data, error } = await supabase
          .from('participants')
          .insert([
            { match_id: match.id, user_id: user.id }
          ])
          .select();
        
        if (error) {
          console.error("Error joining match:", error);
          throw error;
        }
        
        console.log("Successfully joined match:", data);
        
        const newAvailableSlots = Math.max(0, latestMatch.available_slots - 1);
        
        const { error: updateError } = await supabase
          .from('matches')
          .update({ available_slots: newAvailableSlots })
          .eq('id', match.id);
        
        if (updateError) {
          console.error("Error updating match slots:", updateError);
          
          await supabase
            .from('participants')
            .delete()
            .eq('match_id', match.id)
            .eq('user_id', user.id);
            
          throw new Error("Could not update available slots");
        }
        
        toast({
          title: "Success!",
          description: "You've joined the match. See you there!",
        });
        
        await fetchMatchDetails(true);
        
      } catch (error: any) {
        console.error("Error joining match:", error);
        toast({
          title: "Error",
          description: error.message || "There was an error joining the match. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsJoining(false);
      }
    });
  };

  const handleLeaveMatch = async () => {
    if (!user || !match) return;
    
    await performAtomicOperation(async () => {
      setIsJoining(true);
      
      try {
        const userParticipant = participants.find(p => p.user_id === user.id);
        if (!userParticipant) {
          toast({
            title: "Not a participant",
            description: "You are not participating in this match.",
            variant: "destructive",
          });
          return;
        }
        
        const { data: latestMatch, error: latestMatchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', match.id)
          .single();
        
        if (latestMatchError) {
          throw new Error("Could not fetch latest match data");
        }
        
        console.log("Starting leave transaction");
        
        const { error: deleteError } = await supabase
          .from('participants')
          .delete()
          .eq('id', userParticipant.id);
        
        if (deleteError) {
          console.error("Error leaving match:", deleteError);
          throw deleteError;
        }
        
        const newAvailableSlots = Math.min(latestMatch.available_slots + 1, match.team_size);
        const { error: updateError } = await supabase
          .from('matches')
          .update({ available_slots: newAvailableSlots })
          .eq('id', match.id);
        
        if (updateError) {
          console.error("Error updating match slots:", updateError);
          throw new Error("Could not update available slots");
        }
        
        toast({
          title: "You've left the match",
          description: "You are no longer participating in this match.",
        });
        
        await fetchMatchDetails(true);
        
      } catch (error: any) {
        console.error("Error leaving match:", error);
        toast({
          title: "Error",
          description: error.message || "There was an error leaving the match. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsJoining(false);
      }
    });
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId, user?.id]);

  useEffect(() => {
    if (!matchId) return;
    
    const channel = supabase
      .channel('match-detail-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('Participants change detected:', payload);
          fetchMatchDetails(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          console.log('Match data change detected:', payload);
          fetchMatchDetails(true);
        }
      )
      .subscribe();
    
    console.log('Subscribed to realtime updates for match details');
    
    return () => {
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    if (user && participants.length >= 0) {
      const userIsParticipant = participants.some(p => p.user_id === user.id);
      if (isJoinSuccess !== userIsParticipant) {
        console.log(`Synchronizing join state: ${userIsParticipant ? 'User is participating' : 'User is not participating'}`);
        setIsJoinSuccess(userIsParticipant);
      }
    }
  }, [participants, user, isJoinSuccess]);

  const userIsParticipant = user && participants.some(p => p.user_id === user.id);
  const matchIsFull = match ? match.available_slots <= 0 : false;
  const isHost = user && match && user.id === match.host_id;

  return {
    match,
    participants,
    host,
    isLoading,
    error,
    isJoining: isJoining || isProcessingTransaction,
    isJoinSuccess,
    userIsParticipant,
    matchIsFull,
    isHost,
    handleJoinMatch,
    handleLeaveMatch
  };
};
