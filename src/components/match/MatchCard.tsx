
import React from 'react';
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
          {match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}
        </h3>
        <div className="flex gap-2">
          {isLive && (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live
            </Badge>
          )}
          <Badge className={`${match.available_slots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {match.available_slots > 0 ? `${match.available_slots} spots left` : 'Full'}
          </Badge>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-gray-700 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
          {match.location}
        </p>
        <p className="text-gray-700 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
          {new Date(match.match_time).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
        <p className="text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          {match.team_size} players ({match.skill_level})
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
          onClick={() => navigate(`/matches/${match.id}`)}
          className="flex-1 bg-sportyfi-orange hover:bg-red-600 text-white"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
