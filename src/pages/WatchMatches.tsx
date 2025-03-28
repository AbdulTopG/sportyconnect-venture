
import { useNavigate } from 'react-router-dom';
import SportyFiHeader from '@/components/SportyFiHeader';
import NavigationButtons from '@/components/NavigationButtons';
import { PlayCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import VideoPlayer from '@/components/watch/VideoPlayer';
import MatchTabs from '@/components/watch/MatchTabs';
import { useWatchMatches } from '@/hooks/use-watch-matches';

const WatchMatches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    liveMatches, 
    upcomingMatches, 
    recordedMatches, 
    selectedMatch, 
    handleWatchMatch, 
    handleToggleReminder 
  } = useWatchMatches(!!user);

  return (
    <div className="min-h-screen flex flex-col">
      <SportyFiHeader />
      
      <main className="flex-grow">
        <div className="sportyfi-container py-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <PlayCircle className="mr-2 text-red-500" size={32} /> Watch Matches
          </h1>
          
          <div>
            <div className="w-full">
              <VideoPlayer match={selectedMatch} />
              
              <MatchTabs 
                liveMatches={liveMatches}
                upcomingMatches={upcomingMatches}
                recordedMatches={recordedMatches}
                onWatchMatch={handleWatchMatch}
                onToggleReminder={handleToggleReminder}
                selectedMatchId={selectedMatch?.id}
              />
            </div>
          </div>
        </div>
      </main>
      
      <NavigationButtons />
    </div>
  );
};

export default WatchMatches;
