
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, PlayCircle, Clock, Check } from 'lucide-react';
import { Match } from '@/integrations/supabase/client';

interface MatchCardProps {
  match: Match;
  onWatchMatches: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onWatchMatches }) => {
  const navigate = useNavigate();
  
  return (
    <div key={match.id} className="sportyfi-card hover:shadow-md transition-shadow relative">
      {/* Time indicator */}
      <div className="absolute top-2 right-2">
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(match.match_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Badge>
      </div>
      
      <div className="flex justify-between items-start mb-3 mt-2">
        <h3 className="text-lg font-semibold">
          {match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}
        </h3>
        <div className="flex gap-2">
          {Math.random() > 0.7 && (
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
          <MapPin className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          <span className="truncate">{match.location}</span>
        </p>
        <p className="text-gray-700 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          {new Date(match.match_time).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short', 
            day: 'numeric'
          })}
        </p>
        <p className="text-gray-700 flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
          {match.team_size} players ({match.skill_level})
        </p>
        
        {/* Slots filled indicator */}
        <div className="pt-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Spots filled</span>
            <span>{match.team_size - match.available_slots}/{match.team_size}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-sportyfi-orange rounded-full h-1.5" 
              style={{ width: `${((match.team_size - match.available_slots) / match.team_size) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {Math.random() > 0.7 && (
          <Button 
            onClick={onWatchMatches}
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
