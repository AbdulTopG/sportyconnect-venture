
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MatchesHeaderProps {
  selectedSport: string | null;
  allSports: string[];
  onSportChange: (sport: string) => void;
  onWatchMatches: () => void;
  onCreateMatch: () => void;
  onClearFilter: () => void;
}

const MatchesHeader: React.FC<MatchesHeaderProps> = ({
  selectedSport,
  allSports,
  onSportChange,
  onWatchMatches,
  onCreateMatch,
  onClearFilter
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mb-6`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {selectedSport 
            ? `${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)} Matches` 
            : 'Available Matches'}
        </h1>
        {selectedSport && !isMobile && (
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilter}
              className="text-sportyfi-orange border-sportyfi-orange"
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>

      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
        <div className="w-full md:w-48">
          <Select 
            value={selectedSport || 'all'} 
            onValueChange={onSportChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {allSports.map(sport => (
                <SelectItem key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={onWatchMatches}
            variant="outline"
            className="flex-1 md:flex-auto flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
          >
            <PlayCircle className="h-4 w-4" />
            Watch Matches
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">Live</span>
          </Button>
          
          <Button 
            onClick={onCreateMatch}
            className="flex-1 md:flex-auto bg-sportyfi-orange hover:bg-red-600 text-white"
          >
            Host a Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchesHeader;
