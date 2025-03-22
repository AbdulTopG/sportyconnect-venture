
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Match, supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Users } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onWatchMatch?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onWatchMatch }) => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  
  // Update local state when match prop changes
  useEffect(() => {
    if (match && typeof match === 'object') {
      setCurrentMatch(match);
    }
  }, [match]);
  
  // Subscribe to real-time updates for this specific match
  useEffect(() => {
    if (!match?.id) return;
    
    console.log(`Setting up real-time subscription for match ${match.id}`);
    
    const channel = supabase
      .channel(`match-card-${match.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${match.id}`
        },
        (payload) => {
          console.log('Match data changed:', payload);
          if (payload.new) {
            setCurrentMatch(payload.new as Match);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `match_id=eq.${match.id}`
        },
        (payload) => {
          console.log('Participants changed:', payload);
          // Fetch the updated match data when participants change
          fetchUpdatedMatch(match.id);
        }
      )
      .subscribe();
    
    return () => {
      console.log(`Cleaning up real-time subscription for match ${match.id}`);
      supabase.removeChannel(channel);
    };
  }, [match?.id]);
  
  // Helper function to fetch the latest match data
  const fetchUpdatedMatch = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();
        
      if (error) {
        console.error('Error fetching updated match:', error);
        return;
      }
      
      if (data) {
        console.log('Updated match data:', data);
        setCurrentMatch(data);
      }
    } catch (err) {
      console.error('Error in fetchUpdatedMatch:', err);
    }
  };
  
  // Don't render if no match data is available
  if (!currentMatch) {
    console.log("No match data available for MatchCard");
    return null;
  }
  
  // Removed isLive variable since we no longer need it
  
  // Also removed the handleWatchMatch function since it's no longer needed

  // Safely extract match properties with fallbacks
  const { 
    id,
    sport = "unknown", 
    location = "unknown location", 
    match_time = new Date().toISOString(),
    team_size = 0,
    skill_level = "all",
    available_slots = 0
  } = currentMatch;

  return (
    <div className="sportyfi-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">
          {sport.charAt(0).toUpperCase() + sport.slice(1)}
        </h3>
        <div className="flex gap-2">
          <Badge className={`${available_slots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {available_slots > 0 ? `${available_slots} spots left` : 'Full'}
          </Badge>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          {location}
        </p>
        <p className="text-gray-700 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
          {new Date(match_time).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
        <p className="text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          {team_size} players ({skill_level})
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => navigate(`/matches/${id}`)}
          className="flex-1 bg-sportyfi-orange hover:bg-red-600 text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
