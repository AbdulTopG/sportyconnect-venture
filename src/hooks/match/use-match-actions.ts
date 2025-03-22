
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, Match } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ParticipantWithProfile } from './use-match-participants';

const useMatchActions = (
  match: Match | null, 
  participants: ParticipantWithProfile[],
  fetchParticipants: () => Promise<void>,
  fetchMatchData: (forceRefresh?: boolean) => Promise<Match | null>
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

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
        
        await fetchParticipants();
        await fetchMatchData(true);
        
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
        
        await fetchParticipants();
        await fetchMatchData(true);
        
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

  const userIsParticipant = user && participants.some(p => p.user_id === user.id);
  const matchIsFull = match ? match.available_slots <= 0 : false;
  const isHost = user && match && user.id === match.host_id;

  return {
    isJoining: isJoining || isProcessingTransaction,
    userIsParticipant,
    matchIsFull,
    isHost,
    handleJoinMatch,
    handleLeaveMatch
  };
};

export default useMatchActions;
