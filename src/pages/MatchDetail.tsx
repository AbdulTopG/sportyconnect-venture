
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useShare } from '@/hooks/use-share';
import { supabase, Match, Participant } from '@/integrations/supabase/client';

// Import refactored components
import MatchInfo from '@/components/match/MatchInfo';
import MatchActions from '@/components/match/MatchActions';
import HostInfo from '@/components/match/HostInfo';
import ParticipantsList from '@/components/match/ParticipantsList';
import LoadingState from '@/components/match/LoadingState';
import ErrorState from '@/components/match/ErrorState';

type Host = {
  id: string;
  username?: string;
  email?: string;
};

type ParticipantWithProfile = Participant & {
  profile?: {
    username?: string | null;
    email?: string | null;
  };
};

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shareContent, isSharing } = useShare();
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([]);
  const [host, setHost] = useState<Host | null>(null);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false); // Lock for transactions

  // Function to fetch match details and participants, ensuring data is synchronized
  const fetchMatchDetails = async (forceRefresh = false) => {
    if (!id) return;
    
    console.log(`Fetching match details${forceRefresh ? ' (forced refresh)' : ''}`);

    if (isProcessingTransaction && !forceRefresh) {
      console.log("Skipping fetch during transaction processing");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get match data
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (matchError) {
        console.error("Error fetching match:", matchError);
        setError("Failed to load match details. Please try again.");
        return;
      }
      
      console.log("Fetched match data:", matchData);
      
      // Get participants in a single query
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('match_id', id);
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return;
      }
      
      console.log("Participants fetched:", participantsData);
      
      // Calculate available slots based on participants count
      const participantCount = participantsData?.length || 0;
      const calculatedAvailableSlots = Math.max(0, matchData.team_size - participantCount);
      
      // Update match data with calculated available slots
      const updatedMatchData = {
        ...matchData,
        available_slots: calculatedAvailableSlots
      };
      
      // Only update if different from what's in the database
      if (matchData.available_slots !== calculatedAvailableSlots) {
        console.log(`Updating available slots from ${matchData.available_slots} to ${calculatedAvailableSlots}`);
        
        const { error: updateError } = await supabase
          .from('matches')
          .update({ available_slots: calculatedAvailableSlots })
          .eq('id', id);
        
        if (updateError) {
          console.error("Error updating available slots:", updateError);
        }
      }
      
      setMatch(updatedMatchData);
      
      // Fetch host information
      if (matchData.host_id) {
        const { data: hostData, error: hostError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', matchData.host_id)
          .maybeSingle();
        
        if (hostError && hostError.code !== 'PGRST116') {
          console.error("Error fetching host:", hostError);
        } else if (hostData) {
          setHost({
            id: matchData.host_id,
            username: hostData.username || undefined
          });
        } else {
          setHost({
            id: matchData.host_id
          });
        }
      }
      
      // Process participant profiles
      if (participantsData && participantsData.length > 0) {
        const enhancedParticipants: ParticipantWithProfile[] = [];
        
        for (const participant of participantsData) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', participant.user_id)
              .maybeSingle();
            
            enhancedParticipants.push({
              ...participant,
              profile: {
                username: profileData?.username || null,
              }
            });
          } catch (err) {
            console.error("Error fetching profile for participant:", err);
            enhancedParticipants.push({
              ...participant,
              profile: { username: null }
            });
          }
        }
        
        setParticipants(enhancedParticipants);
      } else {
        setParticipants([]);
      }
      
      // Check if current user is a participant
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

  // Initial data fetch
  useEffect(() => {
    fetchMatchDetails();
  }, [id, user?.id]);

  // Set up realtime subscription for match and participants
  useEffect(() => {
    if (!id) return;
    
    // Subscribe to changes in both the match and participants tables
    const channel = supabase
      .channel('match-detail-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `match_id=eq.${id}`
        },
        (payload) => {
          console.log('Participants change detected:', payload);
          fetchMatchDetails(true); // Force refresh
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Match data change detected:', payload);
          fetchMatchDetails(true); // Force refresh
        }
      )
      .subscribe();
    
    console.log('Subscribed to realtime updates for match details');
    
    // Cleanup subscription
    return () => {
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Synchronize isJoinSuccess with participants data
  useEffect(() => {
    if (user && participants.length >= 0) {
      const userIsParticipant = participants.some(p => p.user_id === user.id);
      if (isJoinSuccess !== userIsParticipant) {
        console.log(`Synchronizing join state: ${userIsParticipant ? 'User is participating' : 'User is not participating'}`);
        setIsJoinSuccess(userIsParticipant);
      }
    }
  }, [participants, user, isJoinSuccess]);

  // Helper to ensure atomicity in join/leave operations
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
      // Allow a small delay before releasing the lock to ensure DB consistency
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
        // First check if the user is already a participant
        if (participants.some(p => p.user_id === user.id)) {
          toast({
            title: "Already joined",
            description: "You are already a participant in this match.",
          });
          return;
        }
        
        // Get fresh match data to ensure accurate slots
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
        
        // Begin transaction
        console.log("Starting join transaction");
        
        // Add participant
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
        
        // Calculate new available slots
        const newAvailableSlots = Math.max(0, latestMatch.available_slots - 1);
        
        // Update available slots in database
        const { error: updateError } = await supabase
          .from('matches')
          .update({ available_slots: newAvailableSlots })
          .eq('id', match.id);
        
        if (updateError) {
          console.error("Error updating match slots:", updateError);
          
          // Rollback by removing the participant
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
        
        // Force refresh data
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
        // Verify user is a participant
        const userParticipant = participants.find(p => p.user_id === user.id);
        if (!userParticipant) {
          toast({
            title: "Not a participant",
            description: "You are not participating in this match.",
            variant: "destructive",
          });
          return;
        }
        
        // Get fresh match data
        const { data: latestMatch, error: latestMatchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', match.id)
          .single();
        
        if (latestMatchError) {
          throw new Error("Could not fetch latest match data");
        }
        
        console.log("Starting leave transaction");
        
        // Remove participant
        const { error: deleteError } = await supabase
          .from('participants')
          .delete()
          .eq('id', userParticipant.id);
        
        if (deleteError) {
          console.error("Error leaving match:", deleteError);
          throw deleteError;
        }
        
        // Update available slots
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
        
        // Force refresh to ensure UI is in sync
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = match ? `${match.sport} Match` : 'Sport Match';
    const shareText = match ? `Join me for a ${match.sport} match at ${match.location}!` : 'Join me for a match!';
    
    await shareContent(shareUrl, {
      title: shareTitle,
      text: shareText,
      fallbackToClipboard: true
    });
  };

  // Computed values
  const userIsParticipant = user && participants.some(p => p.user_id === user.id);
  const matchIsFull = match ? match.available_slots <= 0 : false;
  const isHost = user && match && user.id === match.host_id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <ErrorState error={error} navigate={navigate} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow py-8">
        <div className="sportyfi-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 sportyfi-card">
              <MatchInfo match={match} />
              
              <MatchActions
                match={match}
                userIsParticipant={userIsParticipant || isJoinSuccess}
                isJoining={isJoining || isProcessingTransaction}
                matchIsFull={matchIsFull}
                isHost={isHost}
                isSharing={isSharing}
                handleJoinMatch={handleJoinMatch}
                handleLeaveMatch={handleLeaveMatch}
                handleShare={handleShare}
              />
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <HostInfo host={host} />
              <ParticipantsList participants={participants} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetail;
