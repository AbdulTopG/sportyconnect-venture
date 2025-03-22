
import React from 'react';
import { Button } from '@/components/ui/button';

interface MatchesEmptyStateProps {
  selectedSport: string | null;
  onClearFilter: () => void;
  onCreateMatch: () => void;
}

const MatchesEmptyState: React.FC<MatchesEmptyStateProps> = ({ 
  selectedSport, 
  onClearFilter, 
  onCreateMatch 
}) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-4">
        {selectedSport 
          ? `No matches found for ${selectedSport}` 
          : "No matches found"}
      </h2>
      <p className="mb-6">Try selecting a different sport or host a match yourself!</p>
      {selectedSport && <Button onClick={onClearFilter} className="mr-4">View All Matches</Button>}
      <Button onClick={onCreateMatch} className="bg-sportyfi-orange hover:bg-red-600">Host a Match</Button>
    </div>
  );
};

export default MatchesEmptyState;
