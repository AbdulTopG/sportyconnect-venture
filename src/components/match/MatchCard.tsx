
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/integrations/supabase/client';
import { Calendar, MapPin, Users, PlayCircle } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onWatchMatch?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onWatchMatch }) => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState<Match>(match);
  
  // Update local state when match prop changes
  useEffect(() => {
    setCurrentMatch(match);
  }, [match]);
  
  const isLive = Math.random() > 0.7;
  
  const handleWatchMatch = () => {
    if (onWatchMatch) {
      onWatchMatch();
    } else {
      navigate('/watch');
    }
  };

  return (
    <div className="sportyfi-card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">
          {currentMatch.sport.charAt(0).toUpperCase() + currentMatch.sport.slice(1)}
        </h3>
        <div className="flex gap-2">
          {isLive && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live
            </Badge>
          )}
          <Badge className={`${currentMatch.available_slots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {currentMatch.available_slots > 0 ? `${currentMatch.available_slots} spots left` : 'Full'}
          </Badge>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          {currentMatch.location}
        </p>
        <p className="text-gray-700 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
          {new Date(currentMatch.match_time).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
        <p className="text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          {currentMatch.team_size} players ({currentMatch.skill_level})
        </p>
      </div>
      <div className="flex gap-2">
        {isLive && (
          <Button 
            onClick={handleWatchMatch}
            className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Live
          </Button>
        )}
        <Button 
          onClick={() => navigate(`/matches/${currentMatch.id}`)}
          className="flex-1 bg-sportyfi-orange hover:bg-red-600 text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
