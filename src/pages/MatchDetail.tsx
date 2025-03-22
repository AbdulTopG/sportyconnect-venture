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

  // Function to fetch match details and participants
  const fetchMatchDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use a transaction to ensure we get consistent data
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
      setMatch(matchData);
      
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
      
      // Fetch participants immediately after match data
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('match_id', id);
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return;
      }
      
      console.log("Participants fetched:", participantsData);
      
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
        
        // Explicitly update available_slots based on participants count
        if (matchData && matchData.team_size) {
          const calculatedAvailableSlots = Math.max(0, matchData.team_size - participantsData.length);
          
          // Only update if different from current value
          if (matchData.available_slots !== calculatedAvailableSlots) {
            const { error: updateError } = await supabase
              .from('matches')
              .update({ available_slots: calculatedAvailableSlots })
              .eq('id', id);
              
            if (updateError) {
              console.error("Error updating available slots:", updateError);
            } else {
              // Update local state to match the database
              setMatch({
                ...matchData,
                available_slots: calculatedAvailableSlots
              });
            }
          }
        }
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
  }, [id]);

  // Set up realtime subscription with improved error handling and state synchronization
  useEffect(() => {
    if (!id) return;
    
    // Subscribe to changes in the participants table for this match
    const participantsChannel = supabase
      .channel('match-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `match_id=eq.${id}`
        },
        async (payload) => {
          console.log('Participants change detected:', payload);
          
          // Complete data refresh to ensure consistency
          await fetchMatchDetails();
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
        async (payload) => {
          console.log('Match data change detected:', payload);
          
          // Complete data refresh to ensure consistency
          await fetchMatchDetails();
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [id, user?.id]);

  // This effect tracks when the user is participating and synchronizes UI state
  useEffect(() => {
    if (user && participants.length > 0) {
      const userIsParticipant = participants.some(p => p.user_id === user.id);
      
      // Only update if there's a mismatch to avoid infinite loops
      if (isJoinSuccess !== userIsParticipant) {
        console.log(`Synchronizing join state: ${userIsParticipant ? 'User is participating' : 'User is not participating'}`);
        setIsJoinSuccess(userIsParticipant);
      }
    }
  }, [participants, user]);

  const userIsParticipant = user && participants.some(p => p.user_id === user.id);
  const matchIsFull = match ? match.available_slots <= 0 : false;
  const isHost = user && match && user.id === match.host_id;

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
    
    setIsJoining(true);
    
    try {
      // First check if the user is already a participant
      if (userIsParticipant) {
        toast({
          title: "Already joined",
          description: "You are already a participant in this match.",
        });
        setIsJoining(false);
        return;
      }
      
      // Get fresh match data first to ensure accurate slots
      const { data: latestMatchData, error: latestMatchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', match.id)
        .single();
      
      if (latestMatchError) {
        throw new Error("Could not fetch latest match data");
      }
      
      if (latestMatchData.available_slots <= 0) {
        toast({
          title: "Match is full",
          description: "Sorry, this match is already full.",
          variant: "destructive",
        });
        setIsJoining(false);
        return;
      }
      
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
      
      // Update available slots
      const newAvailableSlots = Math.max(0, latestMatchData.available_slots - 1);
      const { error: updateError } = await supabase
        .from('matches')
        .update({ available_slots: newAvailableSlots })
        .eq('id', match.id);
      
      if (updateError) {
        console.error("Error updating match slots:", updateError);
        // If we can't update the slots, we should remove the participant
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
      
      // Mark as joined in UI immediately
      setIsJoinSuccess(true);
      
      // Force a complete data refresh
      await fetchMatchDetails();
      
    } catch (error: any) {
      console.error("Error joining match:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error joining the match. Please try again.",
        variant: "destructive",
      });
      
      // Reset join success state and refresh data
      setIsJoinSuccess(false);
      await fetchMatchDetails();
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveMatch = async () => {
    if (!user || !match) return;
    
    setIsJoining(true);
    
    try {
      // Verify user is a participant
      if (!userIsParticipant) {
        toast({
          title: "Not a participant",
          description: "You are not participating in this match.",
          variant: "destructive",
        });
        setIsJoining(false);
        return;
      }
      
      // Get fresh match data
      const { data: latestMatchData, error: latestMatchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', match.id)
        .single();
      
      if (latestMatchError) {
        throw new Error("Could not fetch latest match data");
      }
      
      // Remove participant
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('match_id', match.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error leaving match:", error);
        throw error;
      }
      
      // Update available slots
      const newAvailableSlots = latestMatchData.available_slots + 1;
      const { error: updateError } = await supabase
        .from('matches')
        .update({ 
          available_slots: Math.min(newAvailableSlots, match.team_size) 
        })
        .eq('id', match.id);
      
      if (updateError) {
        console.error("Error updating match slots:", updateError);
        throw new Error("Could not update available slots");
      }
      
      // Update local state immediately
      setIsJoinSuccess(false);
      setParticipants(prev => prev.filter(p => p.user_id !== user.id));
      
      toast({
        title: "You've left the match",
        description: "You are no longer participating in this match.",
      });
      
      // Force a complete data refresh to ensure everything is in sync
      await fetchMatchDetails();
      
    } catch (error: any) {
      console.error("Error leaving match:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error leaving the match. Please try again.",
        variant: "destructive",
      });
      
      // Refresh data to ensure UI is in sync with the database
      await fetchMatchDetails();
    } finally {
      setIsJoining(false);
    }
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
                isJoining={isJoining}
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
