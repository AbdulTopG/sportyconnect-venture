
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Match } from '@/integrations/supabase/client';

interface MatchInfoProps {
  match: Match;
}

const MatchInfo = ({ match }: MatchInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default MatchInfo;
