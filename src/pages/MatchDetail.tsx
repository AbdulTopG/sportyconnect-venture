
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
      
      await fetchParticipants();
      
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
    } catch (err) {
      console.error("Unexpected error fetching match details:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dedicated function to fetch participants
  const fetchParticipants = async () => {
    if (!id) return;
    
    try {
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
        
        // Update local match state to reflect correct number of participants
        if (match) {
          // Calculate available_slots based on team_size minus number of participants
          const calculatedAvailableSlots = Math.max(0, match.team_size - participantsData.length);
          
          // Only update if it's different to avoid unnecessary rerenders
          if (match.available_slots !== calculatedAvailableSlots) {
            setMatch({
              ...match,
              available_slots: calculatedAvailableSlots
            });
          }
        }
      } else {
        setParticipants([]);
      }
    } catch (err) {
      console.error("Error in fetchParticipants:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  // Set up realtime subscription to participants table with improved handling
  useEffect(() => {
    if (!id) return;
    
    // Subscribe to changes in the participants table for this match
    const participantsChannel = supabase
      .channel('participants-changes')
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
          
          // Always refetch both participants and match data to ensure consistency
          try {
            // Fetch updated participants
            await fetchParticipants();
            
            // Fetch updated match data
            const { data: updatedMatchData, error: matchUpdateError } = await supabase
              .from('matches')
              .select('*')
              .eq('id', id)
              .single();
              
            if (!matchUpdateError && updatedMatchData) {
              console.log("Updated match data from realtime:", updatedMatchData);
              
              // Update the match state with the latest data from DB
              setMatch(updatedMatchData);
              
              // Sync join success state with actual participation status
              if (user) {
                const isUserParticipating = participants.some(p => p.user_id === user.id);
                setIsJoinSuccess(isUserParticipating);
              }
            }
          } catch (err) {
            console.error("Error refreshing data after realtime update:", err);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [id, user]);

  // This effect synchronizes isJoinSuccess with participants list
  useEffect(() => {
    if (user && participants.length > 0) {
      const userIsCurrentlyParticipant = participants.some(p => p.user_id === user.id);
      if (isJoinSuccess !== userIsCurrentlyParticipant) {
        setIsJoinSuccess(userIsCurrentlyParticipant);
      }
    }
  }, [participants, user, isJoinSuccess]);

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
      
      // Fetch the latest match data to ensure we have accurate available_slots
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
      const newAvailableSlots = latestMatchData.available_slots - 1;
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
      
      // Update local state with the latest data
      setMatch({
        ...match,
        available_slots: newAvailableSlots
      });
      
      setIsJoinSuccess(true);
      
      // Add the new participant to our local state with necessary profile data
      if (data && data[0]) {
        const newParticipant = data[0] as Participant;
        const enhancedParticipant: ParticipantWithProfile = {
          ...newParticipant,
          profile: {
            username: user.email?.split('@')[0] || null
          }
        };
        
        setParticipants(prev => [...prev, enhancedParticipant]);
      }
      
      toast({
        title: "Success!",
        description: "You've joined the match. See you there!",
      });
      
      // Force a complete data refresh to ensure everything is in sync
      await Promise.all([
        fetchMatchDetails(),
        fetchParticipants()
      ]);
      
    } catch (error: any) {
      console.error("Error joining match:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error joining the match. Please try again.",
        variant: "destructive",
      });
      
      // Reset join success state
      setIsJoinSuccess(false);
      
      // Refresh the data to ensure UI is in sync with the database
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
      
      // Fetch the latest match data for accurate state
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
        .update({ available_slots: newAvailableSlots })
        .eq('id', match.id);
      
      if (updateError) {
        console.error("Error updating match slots:", updateError);
        throw new Error("Could not update available slots");
      }
      
      // Update local state
      setMatch({
        ...match,
        available_slots: newAvailableSlots
      });
      
      setParticipants(prev => prev.filter(p => p.user_id !== user.id));
      setIsJoinSuccess(false);
      
      toast({
        title: "You've left the match",
        description: "You are no longer participating in this match.",
      });
      
      // Force a complete data refresh to ensure everything is in sync
      await Promise.all([
        fetchMatchDetails(),
        fetchParticipants()
      ]);
      
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
