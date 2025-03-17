
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

  useEffect(() => {
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
        
        setMatch(matchData);
        
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('*')
          .eq('match_id', id);
        
        if (participantsError) {
          console.error("Error fetching participants:", participantsError);
          setError("Failed to load participants. Please try again.");
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
        } else {
          setParticipants([]);
        }
        
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
    
    fetchMatchDetails();
  }, [id]);

  const userIsParticipant = user && participants.some(p => p.user_id === user.id);
  const matchIsFull = match?.available_slots === 0;
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
      
      const { error: updateError } = await supabase
        .from('matches')
        .update({ available_slots: match.available_slots - 1 })
        .eq('id', match.id);
      
      if (updateError) {
        console.error("Error updating match slots:", updateError);
        toast({
          title: "Warning",
          description: "You've joined the match, but there was an issue updating the available slots.",
          variant: "destructive",
        });
      } else {
        setMatch(prev => prev ? {
          ...prev,
          available_slots: prev.available_slots - 1
        } : null);
        
        if (data && data[0]) {
          const newParticipant = data[0] as Participant;
          setParticipants(prev => [...prev, {
            ...newParticipant,
            profile: { username: null }
          }]);
        }
      }
      
      toast({
        title: "Success!",
        description: "You've joined the match. See you there!",
      });
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
  };

  const handleLeaveMatch = async () => {
    if (!user || !match) return;
    
    setIsJoining(true);
    
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('match_id', match.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error leaving match:", error);
        throw error;
      }
      
      const { error: updateError } = await supabase
        .from('matches')
        .update({ available_slots: match.available_slots + 1 })
        .eq('id', match.id);
      
      if (updateError) {
        console.error("Error updating match slots:", updateError);
        toast({
          title: "Warning",
          description: "You've left the match, but there was an issue updating the available slots.",
          variant: "destructive",
        });
      } else {
        setMatch(prev => prev ? {
          ...prev,
          available_slots: prev.available_slots + 1
        } : null);
        
        setParticipants(prev => prev.filter(p => p.user_id !== user.id));
      }
      
      toast({
        title: "You've left the match",
        description: "You are no longer participating in this match.",
      });
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
                userIsParticipant={userIsParticipant}
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
