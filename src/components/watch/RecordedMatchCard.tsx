
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, Eye } from 'lucide-react';

interface RecordedMatchProps {
  match: {
    id: string;
    title: string;
    sport: string;
    teams: { home: string; away: string };
    thumbnail: string;
    recordedDate: Date;
    duration: string;
    views: number;
    videoUrl: string;
  };
}

const RecordedMatchCard: React.FC<RecordedMatchProps> = ({ match }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  const handleWatch = () => {
    window.open(match.videoUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={match.thumbnail}
          alt={match.title}
          className="w-full h-36 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-gray-700 flex items-center gap-1">
          <Clock size={12} />
          {match.duration}
        </Badge>
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye size={12} />
            {match.views.toLocaleString()}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{match.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-500">{match.sport}</div>
          <div className="text-xs text-gray-500">{formatDate(match.recordedDate)}</div>
        </div>
        <div className="flex justify-between items-center text-sm mb-3">
          <span>{match.teams.home}</span>
          <span>vs</span>
          <span>{match.teams.away}</span>
        </div>
        <Button 
          onClick={handleWatch} 
          className="w-full flex items-center justify-center gap-1"
          size="sm"
        >
          <PlayCircle size={16} />
          Watch Recording
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecordedMatchCard;
