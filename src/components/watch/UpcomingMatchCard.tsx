
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BellRing, Bell } from 'lucide-react';

interface UpcomingMatchProps {
  match: {
    id: string;
    title: string;
    sport: string;
    teams: { home: string; away: string };
    thumbnail: string;
    startTime: Date;
    remindersEnabled: boolean;
  };
  onToggleReminder: () => void;
}

const UpcomingMatchCard: React.FC<UpcomingMatchProps> = ({ match, onToggleReminder }) => {
  const [countdown, setCountdown] = useState('');
  const [isReminderSet, setIsReminderSet] = useState(match.remindersEnabled);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = match.startTime.getTime();
      const timeLeft = startTime - now;
      
      if (timeLeft <= 0) {
        setCountdown('Starting now');
        return;
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [match.startTime]);
  
  const handleToggleReminder = () => {
    setIsReminderSet(!isReminderSet);
    onToggleReminder();
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={match.thumbnail}
          alt={match.title}
          className="w-full h-36 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-blue-500 flex items-center gap-1">
          <Clock size={12} />
          Upcoming
        </Badge>
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary">{countdown}</Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{match.title}</h3>
        <div className="text-xs text-gray-500 mb-2">{match.sport}</div>
        <div className="flex justify-between items-center text-sm mb-3">
          <span>{match.teams.home}</span>
          <span>vs</span>
          <span>{match.teams.away}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center gap-1"
            size="sm"
            onClick={handleToggleReminder}
          >
            {isReminderSet ? (
              <>
                <BellRing size={16} className="text-blue-500" />
                Reminder Set
              </>
            ) : (
              <>
                <Bell size={16} />
                Set Reminder
              </>
            )}
          </Button>
          <Button 
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black"
            size="sm"
            disabled
          >
            Starts Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchCard;
