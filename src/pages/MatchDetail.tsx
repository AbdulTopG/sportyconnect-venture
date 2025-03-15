import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Share2, Copy, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase, Match, Participant } from '@/integrations/supabase/client';

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
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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
    const shareTitle = `${match?.sport} Match`;
    const shareText = `Join me for a ${match?.sport} match at ${match?.location}!`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        console.log('Successfully shared');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share it with your friends to invite them.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share it with your friends to invite them.",
        });
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        toast({
          title: "Sharing failed",
          description: "Could not share or copy the link.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SportyFiHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-xl">Loading match details...</p>
          </div>
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
          <div className="text-center">
            <p className="text-xl text-red-600">{error || "Match not found"}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/matches')}
            >
              Back to Matches
            </Button>
          </div>
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
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{match.sport.charAt(0).toUpperCase() + match.sport.slice(1)} Match</h1>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{match.location}</span>
                  </div>
                  <div className="flex flex-wrap items-center text-gray-600 gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(match.match_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-0 mr-1" />
                      <span>{new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <Badge className={match.available_slots > 0 ? "bg-green-500" : "bg-red-500"}>
                  {match.available_slots > 0 
                    ? `${match.available_slots} spots left` 
                    : "Match Full"}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">About this match</h2>
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {match.skill_level}
                  </span>
                </div>
                <p className="text-gray-700">{match.description || "No description provided."}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-semibold">Team Size: {match.team_size} players</h2>
                </div>
                <p className="text-gray-700">
                  {match.team_size - match.available_slots} joined, {match.available_slots} spots remaining
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {userIsParticipant ? (
                  <Button 
                    onClick={handleLeaveMatch}
                    disabled={isJoining}
                    variant="destructive"
                    className="w-full"
                  >
                    {isJoining ? "Processing..." : "Leave Match"}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinMatch}
                    disabled={isJoining || matchIsFull || isHost}
                    className={`w-full ${!matchIsFull && !isHost ? "bg-sportyfi-orange hover:bg-red-600 text-white" : ""}`}
                  >
                    {isJoining ? "Joining..." : isHost ? "You're the host" : matchIsFull ? "Match Full" : "Join This Match"}
                  </Button>
                )}
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className="w-full"
                >
                  {navigator.share ? (
                    <Share2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {navigator.share ? "Share" : "Copy Link"}
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Host</h2>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={''} />
                    <AvatarFallback>{host?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{host?.username || 'Anonymous Host'}</p>
                    <p className="text-sm text-gray-500">Host</p>
                  </div>
                </div>
              </div>
              
              <div className="sportyfi-card">
                <h2 className="text-lg font-semibold mb-4">Participants ({participants.length})</h2>
                {participants.length > 0 ? (
                  <div className="space-y-3">
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={''} />
                          <AvatarFallback>{participant.profile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{participant.profile?.username || 'Anonymous User'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No participants have joined yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetail;
