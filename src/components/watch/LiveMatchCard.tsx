
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Users } from 'lucide-react';

interface LiveMatchProps {
  match: {
    id: string;
    title: string;
    streamUrl: string;
    viewers: number;
    sport: string;
    teams: { home: string; away: string };
    score: { home: number; away: number };
    thumbnail: string;
    startTime: Date;
  };
  onWatch: () => void;
  isSelected: boolean;
}

const LiveMatchCard: React.FC<LiveMatchProps> = ({ match, onWatch, isSelected }) => {
  // Calculate how long the match has been live
  const getLiveDuration = () => {
    const minutesLive = Math.floor((Date.now() - match.startTime.getTime()) / (1000 * 60));
    if (minutesLive < 60) {
      return `${minutesLive}m`;
    }
    const hours = Math.floor(minutesLive / 60);
    const minutes = minutesLive % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${isSelected ? 'ring-2 ring-red-500' : ''}`}>
      <div className="relative">
        <img
          src={match.thumbnail}
          alt={match.title}
          className="w-full h-36 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-red-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE
        </Badge>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users size={12} />
            {match.viewers.toLocaleString()}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary">{getLiveDuration()}</Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{match.title}</h3>
        <div className="text-xs text-gray-500 mb-2">{match.sport}</div>
        <div className="flex justify-between items-center text-sm mb-3">
          <span>{match.teams.home}</span>
          <span className="font-bold">{match.score.home} - {match.score.away}</span>
          <span>{match.teams.away}</span>
        </div>
        <Button 
          onClick={onWatch} 
          className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-1"
          size="sm"
        >
          <PlayCircle size={16} />
          {isSelected ? 'Now Watching' : 'Watch Live'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LiveMatchCard;
