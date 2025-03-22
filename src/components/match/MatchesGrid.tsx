
import React from 'react';
import { Match } from '@/integrations/supabase/client';
import MatchCard from './MatchCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import LoadingState from './LoadingState';

interface MatchesGridProps {
  matches: Match[];
  filteredMatches: Match[];
  isLoading: boolean;
  error: string | null;
  selectedSport: string | null;
  onWatchMatches: () => void;
  onCreateMatch: () => void;
  onClearFilter: () => void;
}

const MatchesGrid: React.FC<MatchesGridProps> = ({
  matches,
  filteredMatches,
  isLoading,
  error,
  selectedSport,
  onWatchMatches,
  onCreateMatch,
  onClearFilter
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-red-600">{error}</h2>
        <Button onClick={() => window.location.reload()} className="mr-4">Try Again</Button>
      </div>
    );
  }
  
  if (filteredMatches.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">
          {selectedSport 
            ? `No matches found for ${selectedSport}` 
            : "No matches found"}
        </h2>
        <p className="mb-6">Try selecting a different sport or adjusting your filters!</p>
        <Button onClick={onClearFilter} className="mr-4">Clear All Filters</Button>
        <Button onClick={onCreateMatch} className="bg-sportyfi-orange hover:bg-red-600">Host a Match</Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMatches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          onWatchMatches={onWatchMatches} 
        />
      ))}
    </div>
  );
};

export default MatchesGrid;
