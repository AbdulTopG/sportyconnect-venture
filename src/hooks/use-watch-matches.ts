
import { useState, useEffect } from 'react';
import { liveMatches, upcomingMatches, recordedMatches } from '@/data/watchMatchesData';
import { toast } from '@/hooks/use-toast';

export function useWatchMatches(isUserLoggedIn: boolean) {
  const [selectedMatch, setSelectedMatch] = useState<typeof liveMatches[0] | null>(null);
  
  useEffect(() => {
    if (liveMatches.length > 0 && !selectedMatch) {
      setSelectedMatch(liveMatches[0]);
    }
  }, [selectedMatch]);

  const handleWatchMatch = (match: typeof liveMatches[0]) => {
    setSelectedMatch(match);
  };
  
  const handleToggleReminder = (matchId: string) => {
    if (!isUserLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to set match reminders",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reminder Set",
      description: "You'll be notified when this match starts",
    });
  };

  return {
    liveMatches,
    upcomingMatches,
    recordedMatches,
    selectedMatch,
    handleWatchMatch,
    handleToggleReminder
  };
}
